import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { FirebaseUtilsService } from 'src/app/services/utils/firebase-utils.service';
import { UtilsService } from 'src/app/services/utils/utils';
import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { auth } from 'firebase'
import 'firebase/auth'
import { AuthService } from 'src/app/services/auth/auth.service';
import * as R from 'ramda';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links/ngx';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
    userLogin = new FormGroup({
        login: new FormControl('', [Validators.required, Validators.minLength(3)]),
        password: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
    isLoading = false;
    emailSent = false;

    private onDestroy$ = new Subject<void>();

    constructor(private authService: AuthService,
        private userService: UserService,
        private utilsService: UtilsService,
        private firebaseUtilsService: FirebaseUtilsService,
        private firebaseDynamicLinks: FirebaseDynamicLinks,
        private router: Router) {
    }

    ngOnInit() {
        this.authService.confirmSignIn(this.router.url);
        this.firebaseDynamicLinks.onDynamicLink()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((res: any) => {
                console.log(res);
                this.authService.confirmSignIn(this.router.url);
            }, (error: any) => console.log(error));
    }

    login() {
        const isNotValidMail = Validators.email(this.userLogin.get('login'));
        if (isNotValidMail) {
            this.userService.getUserByUserName(this.userLogin.get('login').value)
                .pipe(takeUntil(this.onDestroy$), take(1))
                .subscribe(user => this.loginCore(user.email, this.userLogin.get('password').value),
                    err => this.utilsService.presentErrorToast(err));
        } else {
            this.loginCore(this.userLogin.get('login').value, this.userLogin.get('password').value);
        }
    }

    private loginCore(email: string, password: string) {
        this.authService.login(email, password)
            .then(() => {
                this.userLogin.reset();
                this.router.navigate(['']);
            })
            .catch(err => this.utilsService.presentErrorToast(err));
    }

    async loginGoogle() {
        this.isLoading = true;
        try {
            const credentials = await this.authService.loginGoogle();
            this.createUserIfNew(credentials);
        } catch (err) {
            this.utilsService.presentToast(err);
        }
    }

    private createUserIfNew(credentials: auth.UserCredential) {
        this.firebaseUtilsService.getCurrentUser()
            .pipe(takeUntil(this.onDestroy$), take(1))
            .subscribe((user) => {
                if (!user) {
                    this.userService
                        .add(credentials.user.uid,
                            {
                                email: credentials.user.email,
                                firstName: R.pathOr('', ['additionalUserInfo', 'profile', 'given_name'], credentials),
                                lastName: R.pathOr('', ['additionalUserInfo', 'profile', 'family_name'], credentials),
                                userName: R.pathOr('', ['additionalUserInfo', 'username'], credentials),
                                picture: R.pathOr('', ['additionalUserInfo', 'profile', 'picture'], credentials)

                            })
                        .then(() => {
                            this.isLoading = false;
                            this.router.navigateByUrl('');
                        }).catch(err => {
                            this.isLoading = false;
                            this.utilsService.presentErrorToast(err)
                        });
                }
                this.isLoading = false;
                this.router.navigateByUrl('');
            }, err => {
                this.isLoading = false;
                this.utilsService.presentErrorToast(err)
            });
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

    loginFacebook() {
        alert('Facebook');
    }
}
