import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TodosListService, SharedListService, Globals } from '../../services';
import { TodoList, AutorizedUser } from '../../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

    todoLists: TodoList[];
    sharedLists: TodoList[];
    todoListsShared$: Observable<TodoList[]>;

    constructor(private actionSheetController: ActionSheetController,
        private toastController: ToastController,
        private alertController: AlertController,
        private router: Router,
        private listService: TodosListService,
        private sharedListService: SharedListService) {
    }

    ngOnInit(): void {
        this.listService.getAllUserList()
            .subscribe((todoLists) => {
                this.todoLists = todoLists
        });
        this.sharedListService.getAllUserSharedList()
            .subscribe(todoLists => this.sharedLists = todoLists);
    }

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Nouvelle liste créée',
            duration: 2000
        });
        toast.present();
    }


    async presentAlertConfirm(id: string) {
        const alert = await this.alertController.create({
            header: 'Confirmation!',
            message: 'Delete note <strong>liste Name Here</strong> ?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Delete',
                    handler: () => {
                        this.delete(id);
                    }
                }
            ]
        });
        await alert.present();
    }

    // Quand l'utilisateur clique sur settings
    async presentActionSheet(listId: string) {
        const actionSheet = await this.actionSheetController.create({
            header: 'Actions',
            buttons: [{
                text: 'Delete',
                role: 'destructive',
                icon: 'trash',
                handler: () => {
                    console.log('Delete clicked');
                    this.presentAlertConfirm(listId);
                }
            }, {
                text: 'Share',
                icon: 'person-add',
                handler: () => {
                    this.router.navigateByUrl(`list/${listId}/share`);
                }
            }, {
                text: 'Pinned',
                icon: 'pin',
                handler: () => {
                    console.log('Pinned task');
                }
            }, {
                text: 'Rename',
                icon: 'create',
                handler: () => {
                    console.log('Edit list name');
                }
            }, {
                text: 'Cancel',
                icon: 'close',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }]
        });
        await actionSheet.present();
    }

    openList(id: string) {
        this.router.navigateByUrl(`list/${id}`);
    }

    private delete(id: string) {
        this.listService.delete(id);
    }
}
