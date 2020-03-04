import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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
        private router: Router,
        private toastController: ToastController) {
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
            .then(credentials => {
                this.router.navigate(['']);
            }).catch(err => {
                this.presentToast(err);
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

    async presentToast(msg: string, durationMs: number = 3000) {
        const toast = await this.toastController.create({
            message: msg,
            duration: durationMs
        });
        toast.present();
    }
}
