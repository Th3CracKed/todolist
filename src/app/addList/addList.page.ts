import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TodoList } from '../models/todoList';
import { TodosListService } from '../services';

@Component({
  selector: 'app-addList',
  templateUrl: './addList.page.html',
  styleUrls: ['./addList.page.scss'],
})
export class AddListPage implements OnInit {

  title: string;

  constructor(private todosListService: TodosListService,
    private router: Router) { }

  ngOnInit() {
  }

  addList(){
    let todoList: TodoList = { title: this.title };
    this.todosListService.add(todoList);
    this.router.navigate(['']);
  }
}
