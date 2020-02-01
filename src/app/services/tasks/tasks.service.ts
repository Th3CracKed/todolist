import {Injectable} from '@angular/core';
import {Task} from '../../models';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TasksService {

    private todos$: AngularFirestoreCollection<Task>;

    constructor(private db: AngularFirestore) {
        this.todos$ = this.db.collection<Task>('/todoList');
    }

    getAll(listId: string, withId: boolean = false): Observable<Task[]> {
        const filteredTodos$ = this.db.collection<Task>('/todoList', ref => ref.where('listId', '==', listId));
        return withId ? filteredTodos$.snapshotChanges()
            .pipe(map(todoWithMetaData => {
                return todoWithMetaData.map(todoListWithMetaData => {
                    return {
                        id: todoListWithMetaData.payload.doc.id,
                        ...todoListWithMetaData.payload.doc.data()
                    } as Task;
                });
            })) : filteredTodos$.valueChanges();
    }

  getOne(id: string): Observable<Task> {
      return this.db.doc<Task>(`/todoList/${id}`).valueChanges();
  }

  add(todo: Task) {
      return this.todos$.add(todo);
  }

    update(id: string, newTodo: Partial<Task>) {
        return this.db.doc<Task>(`/todoList/${id}`).update(newTodo);
    }

    delete(id: string) {
        return this.db.doc<Task>(`/todoList/${id}`).delete();
    }
}
