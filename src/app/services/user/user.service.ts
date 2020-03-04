import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/models';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFirestore) { }


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
