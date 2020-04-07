import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../../services/user/user.service';
import { User } from 'src/app/models';
import * as R from 'ramda';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private afAuth: AngularFireAuth,
    private userService: UserService,
    private platform: Platform,
    private nativeStorage: NativeStorage) { }

  async signupUser(user: Partial<User>, password: string): Promise<firebase.User> {
    try {
      await this.setFirstLogin();
      const firebaseUser = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, password);
      this.userService.add(firebaseUser.user.uid,
        {
          email: user.email,
          firstName: R.pathOr('', ['firstName'], user),
          lastName: R.pathOr('', ['lastName'], user),
          userName: R.pathOr('', ['userName'], user)
        }
      );
      return firebaseUser.user;
    } catch (err) {
      console.error(err);
    }
  } 
  
  private async setFirstLogin() {
    if (this.platform.is('cordova')) {
      try {
        await this.nativeStorage.setItem('first_login', true);
      } catch (error) {
        console.error('Error storing item', error);
      }
    }
  }
}
