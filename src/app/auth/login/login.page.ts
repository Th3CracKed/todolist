import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { FirebaseUtilsService } from 'src/app/services/utils/firebase-utils.service';
import { UtilsService } from 'src/app/services/utils/utils';
import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { auth } from 'firebase'
import 'firebase/auth'

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
    private onDestroy$ = new Subject<void>();

    constructor(private afAuth: AngularFireAuth,
        private userService: UserService,
        private utilsService: UtilsService,
        private gplus: GooglePlus,
        private platform: Platform,
        private firebaseUtilsService: FirebaseUtilsService,
        private router: Router) {
    }

    ngOnInit() {
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
        this.afAuth.auth
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                this.userLogin.reset();
                this.router.navigate(['']);
            })
            .catch(err => this.utilsService.presentErrorToast(err));
    }

    async loginGoogle() {
        this.isLoading = true;
        try {
            let credentials;
            if (!this.platform.is('cordova')) {
                credentials = await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
            } else {
                credentials = await this.nativeLogin();
            }
            this.createUserIfNew(credentials);
        } catch (err) {
            console.error(err);
            this.utilsService.presentToast(err);
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

    createUserIfNew(credentials: auth.UserCredential) {
        this.firebaseUtilsService.getCurrentUser()
            .pipe(takeUntil(this.onDestroy$), take(1))
            .subscribe((user) => {
                if (!user) {
                    this.userService.add(credentials.user.uid, { email: credentials.user.email })
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

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    loginFacebook() {
        alert('Facebook');
    }
}
