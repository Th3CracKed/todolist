import { Injectable } from '@angular/core';
import { Task } from '../../models';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TasksService {

    constructor(private db: AngularFirestore) {
    }

    getAll(listId: string, withId: boolean = false): Observable<Task[]> {
        const filteredTodos$ = this.db.collection<Task>('/tasks', ref => ref.where('listId', '==', listId));
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
        return this.db.doc<Task>(`/tasks/${id}`).valueChanges();
    }

    add(task: Task) {
        return this.db.collection<Task>('/tasks').add(task);
    }

    update(id: string, newTask: Partial<Task>) {
        return this.db.doc<Task>(`/tasks/${id}`).update(newTask);
    }

    delete(id: string) {
        return this.db.doc<Task>(`/tasks/${id}`).delete();
    }
}
