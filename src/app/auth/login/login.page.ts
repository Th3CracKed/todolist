import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { FirebaseUtilsService } from 'src/app/services/utils/firebase-utils.service';
import { UtilsService } from 'src/app/services/utils/utils';
import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { auth } from 'firebase';
import 'firebase/auth';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links/ngx';
import { Provider } from 'src/app/models';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
    userLogin = new FormGroup({
        login: new FormControl('', [Validators.required, Validators.minLength(3)]),
        password: new FormControl('', [Validators.required, Validators.minLength(3)]),
        remember: new FormControl(true)
    });
    isLoading = false;
    emailSent = false;

    private onDestroy$ = new Subject<void>();
    private NETWORK_ERROR: 7;

    constructor(private authService: AuthService,
        private userService: UserService,
        private utilsService: UtilsService,
        private firebaseUtilsService: FirebaseUtilsService,
        private firebaseDynamicLinks: FirebaseDynamicLinks,
        private platform: Platform,
        private router: Router,
        private nativeStorage: NativeStorage) {
    }

    ngOnInit() {
        this.checkIfCurrentLinkContainsPasswordlessToken();
    }

    private checkIfCurrentLinkContainsPasswordlessToken() {
        if (this.platform.is('cordova')) {
            this.firebaseDynamicLinks.onDynamicLink()
                .pipe(takeUntil(this.onDestroy$))
                .subscribe((res: any) => {
                    this.authService.confirmSignIn(res.deepLink);
                }, (error: any) => console.log(error));
        } else {
            this.authService.confirmSignIn(this.router.url);
        }
    }

    login() {
        const isNotValidMail = Validators.email(this.userLogin.get('login'));
        if (isNotValidMail) {
            this.userService.getUserByUserName(this.userLogin.get('login').value)
                .pipe(takeUntil(this.onDestroy$), take(1))
                .subscribe(user => this.loginCore(user.email, this.userLogin.get('password').value, this.userLogin.get('remember').value),
                    err => this.utilsService.presentErrorToast(err));
        } else {
            this.loginCore(this.userLogin.get('login').value, this.userLogin.get('password').value, this.userLogin.get('remember').value);
        }
    }

    private loginCore(email: string, password: string, remember: boolean) {
        this.authService.login(email, password, remember)
            .then(async () => {
                await this.setFirstLogin();
                this.userLogin.reset({ remember: { value: true } });
                this.router.navigate(['']);
            })
            .catch(err => this.utilsService.presentErrorToast(err));
    }


    async loginGoogle() {
        this.isLoading = true;
        try {
            const credentials = await this.authService.loginGoogle();
            await this.setFirstLogin();
            this.createUserIfNew(credentials, Provider.Google);
        } catch (err) {
            this.isLoading = false;
            let errorMSG = '';
            switch (err) {
                case this.NETWORK_ERROR:
                    errorMSG = 'Check your internet connexion.'
                    break;
                default:
                    errorMSG = err;
            }
            this.utilsService.presentToast(errorMSG);
        }
    }

    async loginFacebook() {
        this.isLoading = true;
        try {
            const credentials = await this.authService.loginFacebook();
            await this.setFirstLogin();
            this.createUserIfNew(credentials, Provider.Facebook);
        } catch (err) {
            this.isLoading = false;
            this.utilsService.presentToast(err);
        }
    }

    private createUserIfNew(credentials: auth.UserCredential, provider: Provider) {
        this.firebaseUtilsService.getCurrentUser()
            .pipe(takeUntil(this.onDestroy$), take(1))
            .subscribe((user) => {
                if (!user) {
                    const extractedUserInfo = this.authService.extractUserInfo(credentials, provider);
                    this.userService
                        .add(credentials.user.uid,
                            {
                                email: credentials.user.email,
                                ...extractedUserInfo
                            })
                        .then(() => {
                            this.isLoading = false;
                            this.router.navigateByUrl('');
                        }).catch(err => {
                            this.isLoading = false;
                            this.utilsService.presentErrorToast(err);
                        });
                }
                this.isLoading = false;
                this.router.navigateByUrl('');
            }, err => {
                this.isLoading = false;
                this.utilsService.presentErrorToast(err);
            });
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

    async sendEmailLink() {
        const email = this.userLogin.get('login').value;
        if (email) {
            try {
                await this.authService.sendEmailLink(email);
                window.localStorage.setItem('emailForSignIn', email);
                this.emailSent = true;
                this.utilsService.presentToast('Email sent');
            } catch (err) {
                this.utilsService.presentErrorToast(err.message);
            }
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

}
