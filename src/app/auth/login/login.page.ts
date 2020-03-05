import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { FirebaseUtilsService } from 'src/app/services/utils/firebase-utils.service';
import { UtilsService } from 'src/app/services/utils/utils';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    userLogin = new FormGroup({
        login: new FormControl('', [Validators.required, Validators.minLength(3), Validators.email]),
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
        // TODO isMail ? login : checkIfUserNameExistsThenLogin
        this.afAuth.auth
            .signInWithEmailAndPassword(this.userLogin.get('login').value, this.userLogin.get('password').value)
            .then(() => {
                this.userLogin.reset();
                this.router.navigate(['']);
            });
        // TODO login failed
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
                    this.userService.add(
                        {
                            userId: credentials.user.uid,
                            email: credentials.user.email
                        }
                    ).catch(this.utilsService.presentToast);
                }
                this.router.navigateByUrl('');
            });
    }

    loginFacebook() {
        alert('Facebook');
    }

    resetPassword(email: string): Promise<void> {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }

    logout() {
        this.afAuth.auth.signOut();
    }
}
