import { Injectable } from '@angular/core';
import { AutorizedUser, TodoList } from '../../models';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';
import { FirebaseUtilsService } from '../utils/firebase-utils.service';

@Injectable({
    providedIn: 'root'
})
export class SharedListService {

    constructor(private db: AngularFirestore,
        private firebaseUtilsService: FirebaseUtilsService) { }

    getListsSharedInfo(listId: string): Observable<AutorizedUser[]> {
        return this.db.collection<AutorizedUser>(`/todoLists/${listId}/authorizedUsers`)
            .snapshotChanges().pipe(map(this.firebaseUtilsService.includeIds));
    }

    getAllUserSharedList(): Observable<TodoList[]> {
        return this.firebaseUtilsService.getCurrentUser()
            .pipe(switchMap(currentUser => this.getUserSharedTodoLists(currentUser.email)));
    }

    private getUserSharedTodoLists(email: string): Observable<TodoList[]> {
        return this.db.collectionGroup<TodoList>(`authorizedUsers`, ref => ref.where('email', 'array-contains', email))
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
