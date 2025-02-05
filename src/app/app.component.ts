import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationEnd, NavigationCancel, NavigationError, NavigationStart } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseUtilsService } from './services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MessagingService } from './services/messaging/messaging.service';
import { UtilsService } from './services/utils/utils';
import * as R from 'ramda';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    hideOnRoute = ['login', 'register', 'help', 'reset-password'];
    loading = false;
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
        private messagingService: MessagingService,
        private nativeStorage: NativeStorage
    ) {
        this.initializeApp();
        this.conditionallyHideSideMenu();
        this.showNotifications();
        this.loadingAnimation();
    }

    ngOnInit() {
    }

    logout() {
        this.afAuth.auth.signOut();
        this.firebaseUtilsService.unSetCurrentUser();
        this.navCtrl.navigateRoot(['login']);
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private initializeApp() {
        this.platform.ready().then(async () => {
            if (this.platform.is('cordova')) {
                try {
                    await this.nativeStorage.setItem('first_login', false);
                } catch (error) {
                    console.error('Error storing item', error);
                }
            }
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
                if (msg) {
                    const body: string = this.platform.is('cordova') ? R.path(['body'], msg) : R.path(['notification', 'body'], msg);
                    body ? this.utils.presentToast(body) : console.error('something go wrong, notification is empty');
                }
            }, err => console.error(err));
    }

    private loadingAnimation() {
        this.router.events.subscribe(event => {
            switch (true) {
                case event instanceof NavigationStart: {
                    this.loading = true;
                    break;
                }

                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError: {
                    this.loading = false;
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }

}
