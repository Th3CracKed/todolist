import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from 'src/app/models';
import { UtilsService } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private afAuth: AngularFireAuth,
    private userService: UserService) { }

  async signupUser(user: Partial<User>, password: string): Promise<firebase.User> {
    try {
      const firebaseUser = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, password);
      this.userService.add(
        {
          userId: firebaseUser.user.uid,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName
        }
      );
      return firebaseUser.user;
    } catch (err) {
      console.error(err);
    }
  }
}
