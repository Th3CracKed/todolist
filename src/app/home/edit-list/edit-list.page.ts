import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { FirebaseUtilsService, TodosListService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../services/utils/utils';
import { Subject } from 'rxjs';
import { TodoList } from '../../models';

@Component({
    selector: 'app-edit-list',
    templateUrl: './edit-list.page.html',
    styleUrls: ['./edit-list.page.scss'],
})
export class EditListPage implements OnInit, OnDestroy {

    editListForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(1)])
    });

    todoList: TodoList;
    currentUserId: string;
    todoListId: string;


    constructor(private route: ActivatedRoute,
        private todoListService: TodosListService,
        private utilsService: UtilsService,
        private firebaseUtilsService: FirebaseUtilsService,
        private router: Router,
        private utils: UtilsService) {
    }

    private onDestroy$ = new Subject<void>();


    ngOnInit() {
        this.route.params.subscribe(async params => {
            this.todoListId = params['id'];
            this.getTodoList(this.todoListId);
            this.firebaseUtilsService.getCurrentUser().pipe(
                takeUntil(this.onDestroy$),
            ).subscribe(user => this.currentUserId = user.id);
        }, (err: string) => this.utilsService.presentErrorToast(err));
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private getTodoList(listId: string) {
        this.todoListService.getOne(listId).pipe(
            takeUntil(this.onDestroy$),
        )
            .subscribe(
                todoList => this.todoList = todoList,
                err => this.utilsService.presentErrorToast(err)
            );

    }

    editList() {
        const newtitleValue = this.editListForm.get('title').value;

        const newtodoList: TodoList = {
            id: this.todoListId || undefined,
            userId: this.currentUserId || undefined,
            title: newtitleValue || undefined
        };

        this.todoListService.update(this.todoListId, newtodoList).then(list => {
            this.editListForm.reset();
            this.utils.presentToast('List name edided Successfully', 1000);
            this.router.navigateByUrl('');
        }).catch(err => this.utils.presentErrorToast(err));
    }

    resetForm() {
        this.editListForm.reset();
    }
}
