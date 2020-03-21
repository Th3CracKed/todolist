import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform, NavController } from '@ionic/angular';
import { FirebaseUtilsService } from '..';
import { Router } from '@angular/router';
import { auth } from 'firebase'
import 'firebase/auth'
import { environment } from 'src/environments/environment';
import { Facebook } from '@ionic-native/facebook/ngx';
import * as R from 'ramda';
import { Provider } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
    private gplus: GooglePlus,
    private platform: Platform,
    private firebaseUtilsService: FirebaseUtilsService,
    private navCtrl: NavController,
    private fb: Facebook,
    private router: Router) { }

  login(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
  }

  loginGoogle() {
    if (!this.platform.is('cordova')) {
      return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
    } else {
      return this.nativeGoogleLogin();
    }
  }

  private async nativeGoogleLogin() {
    const user = await this.gplus.login({
      webClientId: environment.googleWebClientId,
      offline: true,
      scopes: 'profile email'
    });
    return this.afAuth.auth.signInWithCredential(auth.GoogleAuthProvider.credential(user.idToken));
  }

  async loginFacebook() {
    if (!this.platform.is('cordova')) {
      return this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider())
    } else {
      const response = await this.fb.login(['public_profile', 'email']);
      const facebookCredential = auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);
      return this.afAuth.auth.signInWithCredential(facebookCredential)
    }
  }

  extractUserInfo(credentials: auth.UserCredential, provider: Provider) {
    switch (provider) {
      case Provider.Google:
        return this.extractUserGoogle(credentials);
      case Provider.Facebook:
        return this.extractUserFacebook(credentials);
      default:
        console.error('Unable to extract inforamtions');
        break;
    }
  }

  private extractUserGoogle(credentials: auth.UserCredential) {
    return {
      firstName: R.pathOr('', ['additionalUserInfo', 'profile', 'given_name'], credentials),
      lastName: R.pathOr('', ['additionalUserInfo', 'profile', 'family_name'], credentials),
      userName: R.pathOr('', ['additionalUserInfo', 'username'], credentials),
      picture: R.pathOr('', ['additionalUserInfo', 'profile', 'picture'], credentials)
    }
  }

  private extractUserFacebook(credentials: auth.UserCredential) {
    return {
      firstName: R.pathOr('', ['additionalUserInfo', 'profile', 'first_name'], credentials),
      lastName: R.pathOr('', ['additionalUserInfo', 'profile', 'last_name'], credentials)
    }
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
        this.router.navigate(['']);
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