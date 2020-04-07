import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TodosListService, SharedListService, FirebaseUtilsService } from '../../services';
import { TodoList, User } from '../../models';
import { Observable, Subject } from 'rxjs';
import { UtilsService } from 'src/app/services/utils/utils';
import { takeUntil } from 'rxjs/operators';
import { MessagingService } from 'src/app/services/messaging/messaging.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit, OnDestroy {

    todoLists: TodoList[];
    todoListsShared$: Observable<TodoList[]>;
    currentUserId: string;
    hideColor: boolean;
    private onDestroy$ = new Subject<void>();
    filtredTodoLists: TodoList[];

    constructor(private actionSheetController: ActionSheetController,
        private alertController: AlertController,
        private router: Router,
        private listService: TodosListService,
        private sharedListService: SharedListService,
        private utilsService: UtilsService,
        private firebaseUtilsService: FirebaseUtilsService,
        private todoListService: TodosListService,
        private messagingService: MessagingService) {
    }

    ngOnInit() {
        this.firebaseUtilsService.getCurrentUser()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(user => {
                this.currentUserId = user.id;
                this.getAllUsers();
                this.setupNotification(user);
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
                        this.showAlertNow(list);
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
                    text: 'Change color',
                    icon: 'color-fill',
                    handler: () => {
                        this.presentAlertRadio(list);
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

    onSearchChange(event) {
        const prefix = event.detail.value.toLowerCase();
        this.filtredTodoLists = this.todoLists.filter(todoList => todoList.title.toLowerCase().startsWith(prefix));
    }

    async presentAlertRadio(list: TodoList) {
        const alert = await this.alertController.create({
            header: 'Select color',
            inputs: [
                {
                    name: 'radio1',
                    type: 'radio',
                    label: 'Blue',
                    value: 'primary',
                    checked: true
                },
                {
                    name: 'radio3',
                    type: 'radio',
                    label: 'Purple',
                    value: 'tertiary'
                },
                {
                    name: 'radio4',
                    type: 'radio',
                    label: 'Green',
                    value: 'success'
                },
                {
                    name: 'radio5',
                    type: 'radio',
                    label: 'Orange',
                    value: 'warning'
                },
                {
                    name: 'radio6',
                    type: 'radio',
                    label: 'Dark',
                    value: 'dark'
                },
                {
                    name: 'radio7',
                    type: 'radio',
                    label: 'Gray',
                    value: 'medium'
                },
                {
                    name: 'radio8',
                    type: 'radio',
                    label: 'Light',
                    value: 'light'
                },
                {
                    name: 'radio9',
                    type: 'radio',
                    label: 'Red',
                    value: 'danger'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Cancel color');
                    }
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        this.pinList(list, data);
                    }
                }
            ]
        });

        await alert.present();
    }


    private pinList(currentList: TodoList, colorValue: string) {

        const newColor = colorValue;

        const newtodoList: TodoList = {
            id: currentList.id || undefined,
            userId: currentList.userId || undefined,
            title: currentList.title || undefined,
            color: newColor
        };

        this.todoListService.update(newtodoList.id, newtodoList).then(list => {
            this.utilsService.presentToast('Color changed successfully!', 1000);
        }).catch(err => this.utilsService.presentErrorToast(err));
    }

    private async showAlertNow(todoList: TodoList) {
        const alert = await this.alertController.create({
            header: 'Confirmation!',
            message: 'Delete note <strong>' + todoList.title + '</strong> ?',
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
                        this.delete(todoList.id);
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

    private setupNotification(user: User) {
        this.messagingService.requestPermission(user.id)
        this.messagingService.receiveMessage();
    }
}
