import { Injectable } from '@angular/core';

import { DocumentChangeAction, AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../models';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, map, take, flatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


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

    private fetchUser = (): Observable<User> => {
        return this.afAuth.user.pipe(
            first(),
            flatMap(firebaseUser => {
                const userId = firebaseUser.uid;
                const email = firebaseUser.email;
                return this.db.collection<User>(`users`, ref => ref.where('userId', '==', userId).limit(1))
                    .snapshotChanges().pipe(
                        take(1),
                        map(infos => infos[0]),
                        map(this.includeId),
                        map(storedUserInfo => {
                            if (storedUserInfo) {
                                this.currentUser = {
                                    id: storedUserInfo.id,
                                    userId: userId,
                                    email: email,
                                    firstName: storedUserInfo.firstName,
                                    lastName: storedUserInfo.lastName,
                                    userName: storedUserInfo.userName
                                }
                                return this.currentUser;
                            }
                            return undefined;
                        })
                    );
            })
        );
    }

}