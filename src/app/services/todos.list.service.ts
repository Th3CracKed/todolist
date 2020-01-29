import { Injectable } from '@angular/core';
import { TodoList } from '../models';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class TodosListService {
    private todos$: AngularFirestoreCollection<TodoList>;

    constructor(private db: AngularFirestore) {
        this.todos$ = this.db.collection<TodoList>('/todoLists');
     }
    
    get(): Observable<TodoList[]>{
      return this.todos$.valueChanges();
    }
  
    add(item: TodoList) {
        this.todos$.add(item);
    }
  
    delete(pos: number){
    //   this.[].items.splice(pos, 1);
        console.log('delete '+pos);
    }
}
