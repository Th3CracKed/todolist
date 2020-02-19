import { Injectable } from '@angular/core';
import { TodoList } from '../../models';
import { Observable } from 'rxjs';
import { map, first, switchMap } from 'rxjs/operators'
import { AngularFirestore } from '@angular/fire/firestore';
import { Globals } from '../globals';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class TodosListService {

    constructor(
        private afAuth: AngularFireAuth,
        private db: AngularFirestore,
        private globals: Globals) { }

    getAll(): Observable<TodoList[]> {
        return this.globals.currentUserId ? this.getTodoLists(this.globals.currentUserId) : this.getUserIdThenList();
    }

    getUserIdThenList(): Observable<TodoList[]> {
        return this.afAuth.user
            .pipe(
                first(),
                switchMap(user => {
                    this.globals.currentUserId = user.uid;
                    return this.getTodoLists(user.uid);
                })
            );
    }

    private getTodoLists(userId: string): Observable<TodoList[]> {
        return this.db.collection<TodoList>('/todoLists', ref => ref.where('userId', '==', userId)).snapshotChanges()
            .pipe(map(todoListsWithMetaData =>
                todoListsWithMetaData.map(todoListWithMetaData => {
                    return {
                        id: todoListWithMetaData.payload.doc.id,
                        ...todoListWithMetaData.payload.doc.data()
                    } as TodoList;
                })
            ));
    }

    getOne(id: string): Observable<TodoList> {
        return this.db.doc<TodoList>(`/todoLists/${id}`).valueChanges();
    }

    add(todoList: TodoList) {
        return this.db.collection<TodoList>('/todoLists').add(todoList);
    }

    update(id: string, newTodoList: TodoList) {
        return this.db.doc<TodoList>(`/todoLists/${id}`).update(newTodoList);
    }

    delete(id: string) {
        return this.db.doc<TodoList>(`/todoLists/${id}`).delete();
    }
}
