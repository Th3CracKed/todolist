import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TodosListService, SharedListService, FirebaseUtilsService } from '../../services';
import { TodoList } from '../../models';
import { Observable, Subject } from 'rxjs';
import { UtilsService } from 'src/app/services/utils/utils';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit, OnDestroy {

    todoLists: TodoList[];
    todoListsShared$: Observable<TodoList[]>;
    currentUserId: string;
    private onDestroy$ = new Subject<void>();

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
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(user => {
                this.currentUserId = user.id;
                this.getAllUsers();
            }, err => console.error(err));
    }

    private getAllUsers() {
        this.sharedListService.getAllUserList()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(todoLists => this.todoLists = todoLists
                , err => console.error(err));
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }


    openList(id: string) {
        this.router.navigateByUrl(`list/${id}`);
    }

    // When user click on settings
    async presentActionSheet(list: TodoList) {
        const conditionalDeleteMenu = this.isOwner(list) ? [{
            text: 'Delete',
            role: 'destructive',
            icon: 'trash',
            handler: () => {
                console.log('Delete clicked');
                this.presentAlertConfirm(list.id);
            }
        }] : [];
        const conditionalSharingMenu = this.isOwner(list) ? [{
            text: 'Share',
            icon: 'person-add',
            handler: () => {
                this.router.navigateByUrl(`list/${list.id}/share`);
            }
        }] : [];

        const conditionalRenameMenu = this.isOwner(list) ? [
            {
                text: 'Rename',
                icon: 'create',
                handler: () => {
                    this.router.navigateByUrl(`list/${list.id}/edit`);
                }
            }] : [];
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
                ...conditionalRenameMenu
                ,
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

    private isOwner(list: TodoList) {
        return this.currentUserId === list.userId;
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
            .catch(err => this.utilsService.presentErrorToast(err));
    }
}
