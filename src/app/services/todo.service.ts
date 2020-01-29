import { Injectable } from '@angular/core';
import { Item, List } from '../models';


@Injectable({
    providedIn: 'root'
})
export class TodoService {

    list = { id: '1', title: 'Ma Liste', items: [{ id: '1', title: 'Faire à manger', isDone: true } as Item, { id: '2', title: 'Faire le ménage', isDone: false } as Item] } as List

    constructor() { }
    
    get(): List {
      return this.list;
    }
  
    add(item: Item) {
      this.list.items.push(item);
    }
  
    delete(pos: number){
      this.list.items.splice(pos, 1);
    }
}
