import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseUtilsService } from 'src/app/services';
import { User } from 'src/app/models';
import { UtilsService } from 'src/app/services/utils/utils';
import * as R from 'ramda';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {

  profilForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    userName: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  currentUser: User;

  constructor(private userService: UserService,
    private firebaseUtilsService: FirebaseUtilsService,
    private utilsService: UtilsService) { }

  ngOnInit() {
    this.firebaseUtilsService.getCurrentUser()
      .subscribe(currentUser => {
        this.profilForm.setValue({
          firstName: R.pathOr<string>('', ['firstName'], currentUser),
          lastName: R.pathOr<string>('', ['lastName'], currentUser),
          userName: R.pathOr<string>('', ['userName'], currentUser),
        });
        this.currentUser = currentUser;
      });
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
