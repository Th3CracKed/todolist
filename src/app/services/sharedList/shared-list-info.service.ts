import { Injectable } from '@angular/core';
import { TodoList, CoreMember } from '../../models';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import 'firebase/firestore'
import { map, flatMap } from 'rxjs/operators';
import { FirebaseUtilsService } from '../utils/firebase-utils.service';

@Injectable({
    providedIn: 'root'
})
export class SharedListService {

    constructor(private db: AngularFirestore,
        private firebaseUtilsService: FirebaseUtilsService) { }

    getAllUserList(): Observable<TodoList[]> {
        return this.firebaseUtilsService.getCurrentUser()
            .pipe(flatMap(currentUser => this.getUserSharedTodoLists(currentUser.id)));
    }

    private getUserSharedTodoLists(userId: string): Observable<TodoList[]> {
        return this.db.collection<TodoList>(`/todoLists`, ref => ref.orderBy(`members.${userId}`))
            .snapshotChanges().pipe(map(this.firebaseUtilsService.includeIds));
    }

    add(listId: string, userId: string, email: string, canEdit: boolean = false) {
        const coreMember: CoreMember = { email: email, canEdit: canEdit };
        return this.editMapValue(listId, userId, () => coreMember);
    }

    update(listId: string, userId: string, coreMember: CoreMember) {
        return this.editMapValue(listId, userId, () => coreMember);
    }

    delete(listId: string, userId: string) {
        return this.editMapValue(listId, userId, () => firestore.FieldValue.delete());
    }

    private editMapValue(listId: string, userId: string, factoryValue: () => CoreMember | firestore.FieldValue) {
        return this.db.doc<any>(`/todoLists/${listId}`).set({
            members: {
                [userId]: factoryValue()
            }
        }, { merge: true });
    }
}
