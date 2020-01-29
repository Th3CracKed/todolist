import { Component } from '@angular/core';
import { List } from '../models';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  list: List;

  constructor(private listService: TodoService) {}

  ngOnInit(): void {
    this.list = this.listService.get();
  }  

  delete(pos: number){
    this.listService.delete(pos);
    this.listService.get();
  }
}
