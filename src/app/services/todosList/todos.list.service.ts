import { Injectable } from '@angular/core';
import { TodoList } from '../../models';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators'
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseUtilsService } from '../utils/firebase-utils.service';

@Injectable({
    providedIn: 'root'
})
export class TodosListService {

    constructor(
        private db: AngularFirestore,
        private firebaseUtilsService: FirebaseUtilsService) { }

    getAllUserList(): Observable<TodoList[]> {
        return this.firebaseUtilsService.getCurrentUser()
            .pipe(switchMap(currentUser => this.getTodoLists(currentUser.userId)));
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
        return this.db.doc<TodoList>(`/todoLists/${id}`).snapshotChanges()
            .pipe(map(todoList => {
                return {
                    id: todoList.payload.id,
                    ...todoList.payload.data
                } as TodoList;
            }));
    }

    add(partialTodoList: { title: string }) {
        return this.firebaseUtilsService.getCurrentUser()
            .pipe(switchMap(currentUser => {
                const todoList: TodoList = { ...partialTodoList, userId: currentUser.userId };
                return this.db.collection<TodoList>('/todoLists').add(todoList);
            }));
    }

    update(id: string, newTodoList: TodoList) {
        return this.db.doc<TodoList>(`/todoLists/${id}`).update(newTodoList);
    }

    delete(id: string) {
        return this.db.doc<TodoList>(`/todoLists/${id}`).delete();
    }
}
