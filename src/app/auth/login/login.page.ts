import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

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

    constructor() {
    }

    ngOnInit() {
    }

    login() {
        alert('Login');
    }

    loginGoogle() {
        alert('google');
    }

    loginFacebook() {
        alert('Facebook');
    }

}
