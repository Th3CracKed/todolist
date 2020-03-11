import {Component} from '@angular/core';

import {Platform, NavController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import { FirebaseUtilsService } from './services';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    hideOnRoute = ['login', 'register', 'help', 'reset-password', 'set-new-password'];

    constructor(
        private afAuth: AngularFireAuth,
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private router: Router,
        private navCtrl: NavController,
        private firebaseUtilsService: FirebaseUtilsService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    logout() {
        this.afAuth.auth.signOut();
        this.firebaseUtilsService.unSetCurrentUser();
        this.navCtrl.navigateRoot(['login']);
    }

    canDisplay() {
        const routeName = this.router.url;
        const routeName2 = routeName.substring(1);
        return !(this.hideOnRoute.indexOf(routeName2) > -1);
    }
}
