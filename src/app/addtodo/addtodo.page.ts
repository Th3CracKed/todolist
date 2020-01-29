import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from '../models/item';
import { TodoService } from '../services';

@Component({
  selector: 'app-addtodo',
  templateUrl: './addtodo.page.html',
  styleUrls: ['./addtodo.page.scss'],
})
export class AddtodoPage implements OnInit {

  title: string;

  constructor(private todoService: TodoService,
    private router: Router) { }

  ngOnInit() {
  }

  addList(){
    let item: Item = { title: this.title };
    this.todoService.add(item);
    this.router.navigate(['']);
  }
}
