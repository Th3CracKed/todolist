import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TodosListService } from '../../services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils/utils';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavController } from '@ionic/angular';


@Component({
    selector: 'app-add-list',
    templateUrl: './add-list.page.html',
    styleUrls: ['./add-list.page.scss'],
})
export class AddlistPage implements OnInit, OnDestroy {

    addListForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(1)])
    });
    private onDestroy$ = new Subject<void>();

    constructor(private todosListService: TodosListService,
        private router: Router,
        private navCtrl: NavController,
        private utils: UtilsService) {
    }

    ngOnInit() {
    }


    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    addList() {
        this.todosListService.add(this.addListForm.get('title').value)
            .pipe(
                takeUntil(this.onDestroy$),
            )
            .subscribe(list => {
                this.addListForm.reset();
                this.utils.presentToast('List Created Successfully', 1000);
                this.navCtrl.navigateBack('').then(() => this.navCtrl.navigateForward([`list/${list.id}`]));
            }, err => this.utils.presentErrorToast(err));
    }

    resetForm() {
        this.addListForm.reset();
    }

}
