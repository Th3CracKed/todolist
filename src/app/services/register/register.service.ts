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
    private userService: UserService,
    private utilsService: UtilsService) { }

  signupUser(user: Partial<User>, password: string): Promise<void> {
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, password)
      .then((firebaseUser) => {
        this.userService.add(
          {
            userId: firebaseUser.user.uid,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName
          }
        ).catch(this.utilsService.presentErrorToast);
      }).catch(this.utilsService.presentErrorToast);
  }
}
