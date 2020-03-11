import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user/user.service';
import { UtilsService } from '../utils/utils';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform, NavController } from '@ionic/angular';
import { FirebaseUtilsService } from '..';
import { Router } from '@angular/router';
import { auth } from 'firebase'
import 'firebase/auth'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
    private gplus: GooglePlus,
    private platform: Platform,
    private firebaseUtilsService: FirebaseUtilsService,
    private navCtrl: NavController) { }

  login(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
  }

  loginGoogle() {
    if (!this.platform.is('cordova')) {
      return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
    } else {
      return this.nativeLogin();
    }
  }

  private async nativeLogin() {
    const user = await this.gplus.login({
      webClientId: environment.googleWebClientId,
      offline: true,
      scopes: 'profile email'
    });
    console.log(user.idToken);
    return this.afAuth.auth.signInWithCredential(auth.GoogleAuthProvider.credential(user.idToken));
  }

  logout() {
    this.afAuth.auth.signOut();
    if (this.platform.is('cordova')) {
      this.gplus.logout();
    }
    this.firebaseUtilsService.unSetCurrentUser();
    this.navCtrl.navigateRoot(['login']);
  }
}