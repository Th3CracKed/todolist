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
            .pipe(map(this.firebaseUtilsService.includeIds));
    }

    getOne(listId: string): Observable<TodoList> {
        return this.db.doc<TodoList>(`/todoLists/${listId}`).valueChanges()
            .pipe(map(todoList => {
                return {
                    id: listId,
                    ...todoList
                } as TodoList;
            }));
    }

    add(title: string) {
        return this.firebaseUtilsService.getCurrentUser()
            .pipe(switchMap(currentUser => {
                const todoList: TodoList = {
                    title: title,
                    userId: currentUser.userId,
                    members: {
                        [currentUser.userId]: {
                            email: currentUser.email,
                            canEdit: true
                        }
                    }
                };
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
