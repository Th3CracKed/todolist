import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TasksService, TodosListService, FirebaseUtilsService } from '../services';
import { Task, TodoList } from '../models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.page.html',
    styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit, OnDestroy {

    todoList: TodoList;
    tasks: Task[];
    newTaskName: string;
    doneCounter: string;
    private id: string;
    currentUserId: string;
    canEdit = false;
    private onDestroy$ = new Subject<void>();

    constructor(private route: ActivatedRoute,
        private todoListService: TodosListService,
        private firebaseUtilsService: FirebaseUtilsService,
        private tasksService: TasksService) {
        this.id = this.route.snapshot.paramMap.get('id');
    }

    ngOnInit() {
        this.firebaseUtilsService.getCurrentUser()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(user => {
                this.currentUserId = user.id;
                this.getTodoList();
                this.getTasks();
            }, err => console.error(err))
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private getTodoList() {
        this.todoListService.getOne(this.id)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(todoList => {
                this.todoList = todoList;
                this.checkIfHasEditPermission();
            }, err => console.error(err));
    }

    private checkIfHasEditPermission() {
        this.canEdit = this.todoList.members[this.currentUserId].canEdit;
    }

    private getTasks() {
        this.tasksService.getAll(this.id, true)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((tasks) => {
                this.setRemainingCounter(tasks);
                this.tasks = tasks;
            }, err => console.error(err));
    }

    private setRemainingCounter(data: Task[]) {
        const remaining = data.filter(d => d.isDone === true);
        this.doneCounter = `${remaining.length}/${data.length}`;
    }

    addTask() {
        this.tasksService.add({ name: this.newTaskName, listId: this.id })
            .then(() => this.newTaskName = '')
            .catch(() => this.newTaskName = '');
    }

    toogleIsDone(task: Task) {
        this.tasksService.update(task.id, { isDone: task.isDone });
    }

    deleteTask(taskId: string) {
        this.tasksService.delete(taskId);
    }

}
