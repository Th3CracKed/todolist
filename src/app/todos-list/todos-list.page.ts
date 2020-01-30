import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodosListService, TodoService } from '../services';
import { TodoList, Todo } from '../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.page.html',
  styleUrls: ['./todos-list.page.scss'],
})
export class TodosListPage implements OnInit {

  todoList$: Observable<TodoList>;
  todo$: Observable<Todo[]>;
  private id: string;

  constructor(private route: ActivatedRoute,
       private todoListService: TodosListService,
       private todoService: TodoService) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.todoList$ = this.todoListService.getOne(this.id);
    this.todo$ = this.todoService.getAll(true);
  }

}
