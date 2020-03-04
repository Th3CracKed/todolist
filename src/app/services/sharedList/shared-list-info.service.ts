import { Injectable } from '@angular/core';
import { AutorizedUser, TodoList } from '../../models';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first, switchMap } from 'rxjs/operators';
import { Globals } from '../globals';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseUtilsService } from '../utils/firebase-utils.service';

@Injectable({
    providedIn: 'root'
})
export class SharedListService {

    constructor(private afAuth: AngularFireAuth,
        private db: AngularFirestore,
        private globals: Globals,
        private firebaseUtilsService: FirebaseUtilsService) { }

    getListsSharedInfo(listId: string): Observable<AutorizedUser[]> {
        return this.db.collection<AutorizedUser>(`/todoLists/${listId}/authorizedUsers`)
            .snapshotChanges().pipe(map(this.firebaseUtilsService.includeIds));
    }

    getAllUserSharedList(): Observable<TodoList[]> {
        return this.globals.currentUserId ? this.getUserSharedTodoLists(this.globals.currentUserId) : this.getUserIdThenGetSharedList();
    }

    private getUserIdThenGetSharedList(): Observable<TodoList[]> {
        return this.afAuth.user
            .pipe(
                first(),
                switchMap(user => {
                    this.globals.currentUserId = user.uid;
                    return this.getUserSharedTodoLists(user.uid);
                })
            );
    }

    private getUserSharedTodoLists(userId: string): Observable<TodoList[]> {
        return this.db.collectionGroup<TodoList>(`authorizedUsers`, ref => ref.where('userId', 'array-contains', userId))
            .snapshotChanges().pipe(map(this.firebaseUtilsService.includeIds));
    }

    add(listId: string, authorizedUser: AutorizedUser) {
        return this.db.collection<AutorizedUser>(`/todoLists/${listId}/authorizedUsers`).add(authorizedUser);
    }

    update(listId: string, authorizedUserId: string, autorizedUser: Partial<AutorizedUser>) {
        return this.db.doc<AutorizedUser>(`/todoLists/${listId}/authorizedUsers/${authorizedUserId}`).update(autorizedUser);
    }

    delete(listId: string, authorizedUserId: string) {
        return this.db.doc<AutorizedUser>(`/todoLists/${listId}/authorizedUsers/${authorizedUserId}`).delete();
    }
}
