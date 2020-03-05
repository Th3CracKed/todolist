import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TasksService, TodosListService} from '../services';
import {Task, TodoList} from '../models';
import {Observable} from 'rxjs';


@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.page.html',
    styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {

    todoList: TodoList;
    tasks: Task[];
    newTaskName: string;
    doneCounter: string;
    private id: string;

    constructor(private route: ActivatedRoute,
                private todoListService: TodosListService,
                private tasksService: TasksService) {
        this.id = this.route.snapshot.paramMap.get('id');
    }

    ngOnInit() {
        this.todoListService.getOne(this.id)
            .subscribe(todoList => {
                this.todoList = todoList;
                console.log(todoList.title)
            });
        this.tasksService.getAll(this.id, true).subscribe((tasks) =>{
            this.setRemainingCounter(tasks);
            this.tasks = tasks;
        });
    }

    setRemainingCounter(data: Task[]) {
        const remaining = data.filter(d => d.isDone === true);
        this.doneCounter = `${remaining.length}/${data.length}`;
    }

    addTask() {
        this.tasksService.add({name: this.newTaskName, listId: this.id})
            .then(() => this.newTaskName = '')
            .catch(() => this.newTaskName = '');
    }

    toogleIsDone(task: Task) {
        this.tasksService.update(task.id, {isDone: task.isDone});
    }

    deleteTask(taskId: string) {
        this.tasksService.delete(taskId);
    }

}
