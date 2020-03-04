import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    hideOnRoute = ['login', 'register', 'help'];

    constructor(
        private afAuth: AngularFireAuth,
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private router: Router
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
        this.router.navigate(['login']);
    }

    canDisplay() {
        const routeName = this.router.url;
        const routeName2 = routeName.substring(1);
        return !(this.hideOnRoute.indexOf(routeName2) > -1);
    }
}
