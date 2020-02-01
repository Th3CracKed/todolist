import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodosListService, TasksService } from '../../services';
import { TodoList, Task } from '../../models';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {

  todoList: TodoList = { title: 'Loading...' };
  tasks$: Observable<Task[]>;
  newTaskName: string;
  private id: string;

  constructor(private route: ActivatedRoute,
    private todoListService: TodosListService,
    private tasksService: TasksService) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.todoListService.getOne(this.id)
      .subscribe(todoList => this.todoList = todoList);
    this.tasks$ = this.tasksService.getAll(this.id, true);
  }

  addTask() {
    this.tasksService.add({ name: this.newTaskName, listId: this.id })
      .then(()=> this.newTaskName = '')
      .catch(() => this.newTaskName = '');
  }

  toogleIsDone(task: Task) {
    this.tasksService.update(task.id, {isDone: task.isDone});
  }
 
  deleteTask(taskId: string) {
    this.tasksService.delete(taskId);
  }

}
