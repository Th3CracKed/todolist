import { Injectable } from '@angular/core';
import { Item } from '../models';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class TodoService {
    private todos$: AngularFirestoreCollection<Item>;

    constructor(private db: AngularFirestore) {
        this.todos$ = this.db.collection<Item>('/todos');
     }
    
    get(): Observable<Item[]>{
      return this.todos$.valueChanges();
    }
  
    add(item: Item) {
        this.todos$.add(item);
    }
  
    delete(pos: number){
    //   this.[].items.splice(pos, 1);
        console.log('delete '+pos);
    }
}
