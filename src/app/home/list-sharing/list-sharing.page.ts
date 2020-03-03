import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Task} from '../../models';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-list-sharing',
    templateUrl: './list-sharing.page.html',
    styleUrls: ['./list-sharing.page.scss'],
})
export class ListSharingPage implements OnInit {

    shareduser$: Observable<Task[]>;
    fakeListOfUsers = [{id: '0125545', email: 'todo@test.fr', canEdit: false}, {id: '81247654', email: 'canEdit@yes.fr', canEdit: true}];

    constructor(private toastController: ToastController) {
    }

    addSharedUser = new FormGroup({
        newSharedUser: new FormControl('', [Validators.required, Validators.minLength(1)])
    });


    async presentToast(msg: string, durationMs: number = 3000) {
        const toast = await this.toastController.create({
            message: msg,
            duration: durationMs
        });
        toast.present();
    }

    ngOnInit() {
    }

    deleteSharedUser(id: any) {
        // todo
        this.presentToast('Delete user');
    }

    toogleCanEdit(user: { canEdit: boolean; id: string; email: string }) {
        // todo
        this.presentToast('Can edit: ' + user.canEdit, 800);
    }

    addSharedUserToList() {
        // todo
    }
}
