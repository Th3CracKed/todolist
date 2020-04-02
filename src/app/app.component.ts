import { Component, OnInit } from '@angular/core';

import { Platform, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseUtilsService } from './services';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { UtilsService } from './services/utils/utils';
import { MessagingService } from './services/messaging/messaging.service';

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
        private utils: UtilsService,
        private menuCtrl: MenuController,
        private afMessaging: AngularFireMessaging,
        private messagingService: MessagingService
    ) {
        this.initializeApp();
        this.conditionallyHideSideMenu();
        this.setupNotifications();
    }

    ngOnInit() {
        window.localStorage.removeItem('first_login');
    }

    logout() {
        this.afAuth.auth.signOut();
        this.firebaseUtilsService.unSetCurrentUser();
        this.navCtrl.navigateRoot(['login']);
    }


    // listen() {
    //     this.afMessaging.messages.pipe(
    //         tap(msg => {
    //             const body: any = (<any>msg).notification.body;
    //             this.utils.presentToast(body);
    //         }));
    // }

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

    private setupNotifications() {
        this.firebaseUtilsService.getCurrentUser()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(user => {
                this.messagingService.requestPermission(user.id)
                this.messagingService.receiveMessage();

                this.messagingService.currentMessage
                    .subscribe(msg => {
                        console.log(msg);
                    });
            }, err => console.error(err));
    }
}
