import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoList, CoreMember } from '../../models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TodosListService, FirebaseUtilsService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import { SharedListService } from 'src/app/services/sharedList/shared-list-info.service';
import { UtilsService } from 'src/app/services/utils/utils';
import { UserService } from 'src/app/services/user/user.service';
import { RegisterService } from 'src/app/services/register/register.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
    selector: 'app-list-sharing',
    templateUrl: './list-sharing.page.html',
    styleUrls: ['./list-sharing.page.scss'],
})
export class ListSharingPage implements OnInit, OnDestroy {

    todoList: TodoList;
    currentUserId: string;

    private onDestroy$ = new Subject<void>();
    constructor(
        private route: ActivatedRoute,
        private todoListService: TodosListService,
        private userService: UserService,
        private registerService: RegisterService,
        private authService: AuthService,
        private utilsService: UtilsService,
        private firebaseUtilsService: FirebaseUtilsService,
        private sharedListInfoService: SharedListService) {
    }

    addSharedUser = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
    });

    ngOnInit() {
        this.route.params.subscribe(async params => {
            const listId = params['id'];
            this.getAuthorizedUsers(listId);
            this.firebaseUtilsService.getCurrentUser().pipe(
                takeUntil(this.onDestroy$),
            ).subscribe(user => this.currentUserId = user.id);
        }, (err: string) => this.utilsService.presentErrorToast(err));
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private getAuthorizedUsers(listId: string) {
        this.todoListService.getOne(listId).pipe(
            takeUntil(this.onDestroy$),
        )
            .subscribe(
                todoList => this.todoList = todoList,
                err => this.utilsService.presentErrorToast(err)
            );

    }

    addUserToList() {
        const email: string = this.addSharedUser.get('email').value;
        this.userService.getUserByEmail(email)
            .pipe(
                takeUntil(this.onDestroy$),
            )
            .subscribe(user => {
                if (user) {
                    this.addUserToListCore(user.id, user.email);
                } else {
                    const randomPassword = Array(15).fill(null).map(() => Math.random().toString(12).substr(2)).join('');
                    this.registerService.signupUser({ email: email }, randomPassword)
                        .then((user) => {
                            this.addUserToListCore(user.uid, user.email);
                            this.authService.sendEmailLink(email);
                        })
                        .catch(err => this.utilsService.presentErrorToast(err));
                }
            }, err => this.utilsService.presentErrorToast(err));
    }

    private async addUserToListCore(userId: string, email: string) {
        try {
            await this.sharedListInfoService
                .add(this.todoList.id, userId, email);
            return this.addSharedUser.reset();
        }
        catch (err) {
            return await this.utilsService.presentErrorToast(err);
        }
    }

    toogleCanEdit(userId: string, member: CoreMember) {
        this.sharedListInfoService.update(this.todoList.id, userId, member)
            .then(() => this.utilsService.presentToast('Updated Successfully', 800))
            .catch(err => this.utilsService.presentErrorToast(err));
    }

    deleteUserFromList(userId: string) {
        if (userId !== this.todoList.userId) {
            this.sharedListInfoService.delete(this.todoList.id, userId)
                .then(() => this.utilsService.presentToast(`Access revoked`))
                .catch(err => this.utilsService.presentErrorToast(err));
        } else {
            this.utilsService.presentToast(`Owner Can't be removed`);
        }
    }
}
