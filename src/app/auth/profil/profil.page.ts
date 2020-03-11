import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseUtilsService } from 'src/app/services';
import { User } from 'src/app/models';
import { UtilsService } from 'src/app/services/utils/utils';
import * as R from 'ramda';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit, OnDestroy {

  profilForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    userName: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  currentUser: User;
  private onDestroy$ = new Subject<void>();

  constructor(private userService: UserService,
    private firebaseUtilsService: FirebaseUtilsService,
    private utilsService: UtilsService) { }

  ngOnInit() {
    this.firebaseUtilsService.getCurrentUser()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(currentUser => {
        this.profilForm.setValue({
          firstName: R.pathOr<string>('', ['firstName'], currentUser),
          lastName: R.pathOr<string>('', ['lastName'], currentUser),
          userName: R.pathOr<string>('', ['userName'], currentUser),
        });
        this.currentUser = currentUser;
      });
  }

  ngOnDestroy() {
    this.onDestroy$.complete();
  }

  updateProfil() {
    if (this.currentUser) {
      const user: Partial<User> = {
        firstName: this.profilForm.get('firstName').value || undefined,
        lastName: this.profilForm.get('lastName').value || undefined,
        userName: this.profilForm.get('userName').value || undefined
      }
      this.userService.update(this.currentUser.id, user)
        .then(_ => this.utilsService.presentToast('Profil Updated Successfully'))
        .catch(err => this.utilsService.presentErrorToast(`Profil Failed ${err}`));
    }
  }

}
