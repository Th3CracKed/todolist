import { Injectable } from '@angular/core';

import { DocumentChangeAction, AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../models';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, map, flatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as R from 'ramda';


@Injectable({
    providedIn: 'root'
})
export class FirebaseUtilsService {

    private currentUser: User;

    constructor(private afAuth: AngularFireAuth,
        private db: AngularFirestore) { }

    includeIds = <T>(documentChangeActions: DocumentChangeAction<T>[]) => {
        return <T[]>documentChangeActions.map(documentChangeAction => this.includeId(documentChangeAction));
    }

    includeId = <T>(documentChangeAction: DocumentChangeAction<T>) => {
        return documentChangeAction ? <T>{
            id: documentChangeAction.payload.doc.id,
            ...documentChangeAction.payload.doc.data()
        } : undefined;
    }

    getCurrentUser = (): Observable<User> => {
        return this.currentUser ? of(this.currentUser) : this.fetchUser();
    }

    unSetCurrentUser = () => {
        this.currentUser = null;
    }

    fetchUser = (): Observable<User> => {
        return this.afAuth.user.pipe(
            first(),
            flatMap(firebaseUser => {
                const userId = firebaseUser.uid;
                const email = firebaseUser.email;
                return this.db.doc<User>(`users/${userId}`)
                    .valueChanges().pipe(
                        map(storedUserInfo => {
                            if (storedUserInfo) {
                                this.currentUser = {
                                    id: userId,
                                    email: email,
                                    ...storedUserInfo
                                }
                                return this.currentUser;
                            } else {
                                return undefined;
                            }
                        })
                    );
            })
        );
    }

}