import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { User } from 'src/app/models';
import { FirebaseUtilsService } from '../utils/firebase-utils.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private db: AngularFirestore,
    private firebaseUtilsService: FirebaseUtilsService) { }

  getUserByEmail(email: string) {
    const user$ = this.db.collection<User>(`/users`, ref => ref.where('email', '==', email)).snapshotChanges();
    return this.getOneUserAndIncludeDocumentId(user$);
  }

  
  getUserByUserName(userName: string) {
    const user$ = this.db.collection<User>(`/users`, ref => ref.where('userName', '==', userName)).snapshotChanges();
    return this.getOneUserAndIncludeDocumentId(user$);
  }

  private getOneUserAndIncludeDocumentId(observable: Observable<DocumentChangeAction<User>[]>){
    return observable.pipe(
      take(1),
      map(datas => datas[0]),
      map(this.firebaseUtilsService.includeId)
    );
  }

  add(user: User) {
    return this.db.collection<User>('/users').add(user);
  }

  update(id: string, newUser: Partial<User>) {
    return this.db.doc<User>(`/users/${id}`).update(newUser);
  }

  delete(id: string) {
    return this.db.doc<User>(`/users/${id}`).delete();
  }
}
