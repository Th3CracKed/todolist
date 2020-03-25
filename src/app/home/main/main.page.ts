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
        private firebaseUtilsService: FirebaseUtilsService,
        private todoListService: TodosListService) {
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
        const actionSheet = await this.actionSheetController.create({
            header: 'Actions',
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    icon: 'trash',
                    handler: () => {
                        this.presentAlertConfirm(list.id);
                    }
                },
                {
                    text: 'Share',
                    icon: 'person-add',
                    handler: () => {
                        this.router.navigateByUrl(`list/${list.id}/share`);
                    }
                },
                {
                    text: list.isPinned ? 'unPin' : 'Pin',
                    icon: 'pin',
                    handler: () => {
                        this.pinList(list);
                    }
                },
                {
                    text: 'Rename',
                    icon: 'create',
                    handler: () => {
                        this.router.navigateByUrl(`list/${list.id}/edit`);
                    }
                }
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

    isOwner(list: TodoList) {
        return this.currentUserId === list.userId;
    }


    private pinList(currentList: TodoList) {

        const pinnedValue = !currentList.isPinned;

        const newtodoList: TodoList = {
            id: currentList.id || undefined,
            userId: currentList.userId || undefined,
            title: currentList.title || undefined,
            isPinned: pinnedValue
        };

        this.todoListService.update(newtodoList.id, newtodoList).then(list => {
            if (pinnedValue) {
                this.utilsService.presentToast('List is pinned Successfully', 1000);
            } else {
                this.utilsService.presentToast('List is unpinned Successfully', 1000);
            }
        }).catch(err => this.utilsService.presentErrorToast(err));
    }

    private async presentAlertConfirm(listId: string) {
        let currentTODO: TodoList;
        this.todoListService.getOne(listId).pipe(
            takeUntil(this.onDestroy$),
        ).subscribe(
            todoList => {
                currentTODO = todoList;
                this.showAlertNow(currentTODO, listId);
            },
            err => this.utilsService.presentErrorToast(err)
        );
    }

    private async showAlertNow(currentTODO: TodoList, listId: string) {
        const alert = await this.alertController.create({
            header: 'Confirmation!',
            message: 'Delete note <strong>' + currentTODO.title + '</strong> ?',
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
