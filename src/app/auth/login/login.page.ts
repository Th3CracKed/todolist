import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

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

    constructor(private afAuth: AngularFireAuth, private router: Router) {
    }

    ngOnInit() {
    }

    login() {
        alert('Login');
    }

    loginGoogle() {
        this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(()=> this.router.navigate(['']));
    }

    loginFacebook() {
        alert('Facebook');
    }

    logout() {
        this.afAuth.auth.signOut();
      }
}
