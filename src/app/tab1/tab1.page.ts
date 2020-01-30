import { Component } from '@angular/core';
import { TodoList } from '../models';
import { TodosListService } from '../services/todosList/todos.list.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  todoLists$: Observable<TodoList[]>;

  constructor(private listService: TodosListService) {}

  ngOnInit(): void {
    this.todoLists$ = this.listService.getAll(true);
  }  

  delete(id: string){
    this.listService.delete(id);
  }
}
