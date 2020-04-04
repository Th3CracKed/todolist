import { Component, OnInit } from '@angular/core';

import { Platform, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseUtilsService } from './services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MessagingService } from './services/messaging/messaging.service';
import { UtilsService } from './services/utils/utils';
import * as R from 'ramda';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    hideOnRoute = ['login', 'register', 'help', 'reset-password'];

    private onDestroy$ = new Subject<void>();
    constructor(
        private afAuth: AngularFireAuth,
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private router: Router,
        private navCtrl: NavController,
        private firebaseUtilsService: FirebaseUtilsService,
        private menuCtrl: MenuController,
        private utils: UtilsService,
        private messagingService: MessagingService
    ) {
        this.initializeApp();
        this.conditionallyHideSideMenu();
        this.showNotifications();
    }

    ngOnInit() {
        window.localStorage.removeItem('first_login');
    }

    logout() {
        this.afAuth.auth.signOut();
        this.firebaseUtilsService.unSetCurrentUser();
        this.navCtrl.navigateRoot(['login']);
    }

    private initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    private conditionallyHideSideMenu() {
        this.router.events
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    this.menuCtrl.enable(this.canDisplay(), 'sideMenu');
                }
            }, err => console.error(err));
    }

    private canDisplay() {
        const fullPath = this.router.url;
        const currentRoute = fullPath.substring(1);
        const canDisplay = !(this.hideOnRoute.indexOf(currentRoute) > -1);
        return canDisplay;
    }

    private showNotifications() {
        this.messagingService.currentMessage
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(msg => {
                console.log(msg);
                if (msg) {
                    const body: any = R.path(['notification', 'body'], msg);
                    this.utils.presentToast(body);
                }
            });
    }
}
