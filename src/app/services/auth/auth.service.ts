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
    return this.afAuth.auth.signInWithCredential(auth.GoogleAuthProvider.credential(user.idToken));
  }

  sendEmailLink(email: string) {
      return this.afAuth.auth.sendSignInLinkToEmail(
        email,
        environment.actionCodeSettings
      );
  }

  async confirmSignIn(url: string) {
    try {
      if (this.afAuth.auth.isSignInWithEmailLink(url)) {
        let email = window.localStorage.getItem('emailForSignIn');

        // If missing email, prompt user for it
        if (!email) {
          email = window.prompt('Please provide your email for confirmation'); // TODO improve this with ionic modal
          window.localStorage.setItem('emailForSignIn', email);
        }

        // Signin user and remove the email localStorage
        const _result = await this.afAuth.auth.signInWithEmailLink(email, url);
        window.localStorage.removeItem('emailForSignIn');
      }
    } catch (err) {
      console.error(err.message);
    }
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