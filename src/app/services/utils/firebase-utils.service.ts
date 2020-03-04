import { Injectable } from '@angular/core';

import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';


@Injectable({
    providedIn: 'root'
})
export class FirebaseUtilsService {

    constructor() { }

    includeIds = <T>(documentChangeAction: DocumentChangeAction<T>[]) => {
        return <T[]>documentChangeAction.map(snap => this.includeId(snap));
    }

    includeId = <T>(documentChangeAction: DocumentChangeAction<T>) => {
        return {
            id: documentChangeAction.payload.doc.id,
            ...documentChangeAction.payload.doc.data()
        };
    }

}