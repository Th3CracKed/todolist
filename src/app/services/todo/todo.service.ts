import { Injectable } from '@angular/core';
import { Todo } from '../../models';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todos$: AngularFirestoreCollection<Todo>;

  constructor(private db: AngularFirestore) {
      this.todos$ = this.db.collection<Todo>('/todoList');
  }

  getAll(withId: boolean = false): Observable<Todo[]> {
      return withId ? this.todos$.snapshotChanges()
          .pipe(map(todoWithMetaData => {
              return todoWithMetaData.map(todoListWithMetaData => {
                  return {
                      id: todoListWithMetaData.payload.doc.id,
                      ...todoListWithMetaData.payload.doc.data()
                  } as Todo;
              });
          })) : this.todos$.valueChanges();
  }

  getOne(id: string): Observable<Todo> {
      return this.db.doc<Todo>(`/todoList/${id}`).valueChanges();
  }

  add(todo: Todo) {
      this.todos$.add(todo);
  }

  update(id: string, newTodo: Todo){
     this.db.doc<Todo>(`/todoList/${id}`).update(newTodo);
  }

  delete(id: string) {
      this.db.doc<Todo>(`/todoList/${id}`).delete();
  }
}
