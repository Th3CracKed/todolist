import { Injectable } from '@angular/core';
import { TodoList } from '../../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class TodosListService {
    private todoList$: AngularFirestoreCollection<TodoList>;

    constructor(private db: AngularFirestore) {
        this.todoList$ = this.db.collection<TodoList>('/todoLists');
    }

    getAll(withId: boolean = false): Observable<TodoList[]> {
        return withId ? this.todoList$.snapshotChanges()
            .pipe(map(todoListsWithMetaData => {
                return todoListsWithMetaData.map(todoListWithMetaData => {
                    return {
                        id: todoListWithMetaData.payload.doc.id,
                        ...todoListWithMetaData.payload.doc.data()
                    } as TodoList;
                });
            })) : this.todoList$.valueChanges();
    }

    getOne(id: string): Observable<TodoList> {
        return this.db.doc<TodoList>(`/todoLists/${id}`).valueChanges();
    }

    add(todoList: TodoList) {
        return this.todoList$.add(todoList);
    }

    update(id: string, newTodoList: TodoList){
       return this.db.doc<TodoList>(`/todoLists/${id}`).update(newTodoList);
    }

    delete(id: string) {
        return this.db.doc<TodoList>(`/todoLists/${id}`).delete();
    }
}
