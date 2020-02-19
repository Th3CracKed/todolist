import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { Globals } from 'src/app/services';

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

    constructor(private afAuth: AngularFireAuth,
                private router: Router,
                private globals: Globals) {
    }

    ngOnInit() {
    }

    login() {
        alert('Login');
    }

    loginGoogle() {
        this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then((credentials) =>{
        this.globals.currentUserId = credentials.user.uid;
        this.router.navigate(['']);
      });
    }

    loginFacebook() {
        alert('Facebook');
    }

    logout() {
        this.afAuth.auth.signOut();
      }
}
