import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { FirebaseUtilsService } from 'src/app/services/utils/firebase-utils.service';
import { UtilsService } from 'src/app/services/utils/utils';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    userLogin = new FormGroup({
        login: new FormControl('', [Validators.required, Validators.minLength(3)]),
        password: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
    isLoading = false;

    constructor(private afAuth: AngularFireAuth,
        private userService: UserService,
        private utilsService: UtilsService,
        private firebaseUtilsService: FirebaseUtilsService,
        private router: Router) {
    }

    ngOnInit() {
    }

    login() {
        const isNotValidMail = Validators.email(this.userLogin.get('login'));
        if (isNotValidMail) {
            this.userService.getUserByUserName(this.userLogin.get('login').value)
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
            .catch(this.utilsService.presentErrorToast);
    }

    loginGoogle() {
        this.isLoading = true;
        this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
            .then(credentials => this.createUserIfNew(credentials))
            .catch(this.utilsService.presentToast);
    }

    createUserIfNew(credentials: auth.UserCredential) {
        this.firebaseUtilsService.getCurrentUser()
            .subscribe((user) => {
                if (!user) {
                    this.userService.add(credentials.user.uid, { email: credentials.user.email })
                        .catch(err => this.utilsService.presentErrorToast(err));
                }
                this.router.navigateByUrl('');
            }, err => this.utilsService.presentErrorToast(err));
    }

    loginFacebook() {
        alert('Facebook');
    }


    logout() {
        this.afAuth.auth.signOut();
    }
}
