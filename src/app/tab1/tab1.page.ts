import { Component } from '@angular/core';
import { TodoList } from '../models';
import { TodosListService } from '../services/todos.list.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  list$: Observable<TodoList[]>;

  constructor(private listService: TodosListService) {}

  ngOnInit(): void {
    this.list$ = this.listService.get();
  }  

  delete(pos: number){
    this.listService.delete(pos);
  }
}
