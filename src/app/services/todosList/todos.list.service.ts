import { Injectable } from '@angular/core';
import { TodoList, Task } from '../../models';
import { Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators'
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
            .pipe(flatMap(currentUser => this.getTodoLists(currentUser.id)));
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
            .pipe(flatMap(currentUser => {
                const todoList: TodoList = {
                    title: title,
                    userId: currentUser.id,
                    members: {
                        [currentUser.id]: {
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

    async delete(id: string) {
        await this.db.doc<TodoList>(`/todoLists/${id}`).delete();
        // TODO better if done in cloud functions check https://firebase.google.com/docs/firestore/manage-data/delete-data#collections
        // https://firebase.google.com/docs/firestore/solutions/delete-collections#cloud_function
        return this.db.collection<Task>('/tasks', ref => ref.where('listId', '==', id)).snapshotChanges()
            .forEach(TasksRefs => TasksRefs.forEach(task => task.payload.doc.ref.delete()));
    }
}
