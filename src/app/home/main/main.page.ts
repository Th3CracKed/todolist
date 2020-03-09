import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TodosListService, SharedListService, FirebaseUtilsService } from '../../services';
import { TodoList } from '../../models';
import { Observable } from 'rxjs';
import { UtilsService } from 'src/app/services/utils/utils';

@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

    todoLists: TodoList[];
    todoListsShared$: Observable<TodoList[]>;
    currentUserId: string;

    constructor(private actionSheetController: ActionSheetController,
        private alertController: AlertController,
        private router: Router,
        private listService: TodosListService,
        private sharedListService: SharedListService,
        private utilsService: UtilsService,
        private firebaseUtilsService: FirebaseUtilsService) {
    }

    ngOnInit() {
        this.firebaseUtilsService.getCurrentUser()
            .subscribe(user => {
                this.currentUserId = user.id;
                this.sharedListService.getAllUserList()
                    .subscribe(todoLists => this.todoLists = todoLists,
                        this.utilsService.presentErrorToast);
            });
    }

    openList(id: string) {
        this.router.navigateByUrl(`list/${id}`);
    }

    // When user click on settings
    async presentActionSheet(list: TodoList) {
        const conditionalDeleteMenu = this.currentUserId === list.userId ? [{
            text: 'Delete',
            role: 'destructive',
            icon: 'trash',
            handler: () => {
                console.log('Delete clicked');
                this.presentAlertConfirm(list.id);
            }
        }]: [];
        const conditionalSharingMenu = this.currentUserId === list.userId? [   {
            text: 'Share',
            icon: 'person-add',
            handler: () => {
                this.router.navigateByUrl(`list/${list.id}/share`);
            }
        }]: [];
        const actionSheet = await this.actionSheetController.create({
            header: 'Actions',
            buttons: [
            ...conditionalDeleteMenu, 
            ...conditionalSharingMenu, 
            {
                text: 'Pinned',
                icon: 'pin',
                handler: () => {
                    console.log('Pinned task');
                }
            },
             {
                text: 'Rename',
                icon: 'create',
                handler: () => {
                    console.log('Edit list name');
                }
            }, 
            {
                text: 'Cancel',
                icon: 'close',
                role: 'cancel',
                handler: () => undefined
            }
        ]
        });
        await actionSheet.present();
    }

    private async presentAlertConfirm(listId: string) {
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
                        this.delete(listId);
                    }
                }
            ]
        });
        await alert.present();
    }


    private delete(listId: string) {
        this.listService.delete(listId)
            .then(() => this.utilsService.presentToast('Deleted Sucessfully'))
            .catch(this.utilsService.presentErrorToast);
    }
}
