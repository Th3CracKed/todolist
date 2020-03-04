import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Task, TodoList, AutorizedUser } from '../../models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { TodosListService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import { SharedListService } from 'src/app/services/sharedList/shared-list-info.service';

@Component({
    selector: 'app-list-sharing',
    templateUrl: './list-sharing.page.html',
    styleUrls: ['./list-sharing.page.scss'],
})
export class ListSharingPage implements OnInit {

    todoList: TodoList;
    autorizedUsers: AutorizedUser[];
    constructor(
        private route: ActivatedRoute,
        private toastController: ToastController,
        private todoListService: TodosListService,
        private sharedListInfoService: SharedListService) {
    }

    addSharedUser = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
    });


    async presentToast(msg: string, durationMs: number = 3000) {
        const toast = await this.toastController.create({
            message: msg,
            duration: durationMs
        });
        toast.present();
    }

    ngOnInit() {
        this.route.params.subscribe(async params => {
            const listId = params['id'];
            this.todoListService.getOne(listId)
                .subscribe((todoList) => {
                    this.sharedListInfoService.getListsSharedInfo(todoList.id)
                        .subscribe((sharedTodoListsInfo) => {
                            this.autorizedUsers = sharedTodoListsInfo;
                        });
                    this.todoList = todoList;
                    // TODO error handling
                });
            // TODO error handling
        });
    }


    addSharedUserToList() {
        const email = this.addSharedUser.get('email').value;
        this.sharedListInfoService
            .add(this.todoList.id, { email: email, canEdit: false })
            .then(() => this.addSharedUser.reset());
        // TODO error handling
    }

    toogleCanEdit(autorizedUser: AutorizedUser) {
        this.sharedListInfoService.update(this.todoList.id, autorizedUser.id, { canEdit: autorizedUser.canEdit })
            .then(() => {
                this.presentToast('Updated Successfully', 800);
            })
    }

    deleteSharedUser(autorizedUser: AutorizedUser) {
        this.sharedListInfoService.delete(this.todoList.id, autorizedUser.id)
            .then(() => {
                this.presentToast(`Access revocked`);
            })
            // TODO error handling
    }
}
