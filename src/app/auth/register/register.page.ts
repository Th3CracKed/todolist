import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    constructor() {
    }

    addUserForm = new FormGroup({
        firstname: new FormControl('', [Validators.required, Validators.minLength(3)]),
        lastname: new FormControl('', [Validators.required, Validators.minLength(3)]),
        email: new FormControl('', [Validators.required, Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        passwords: new FormGroup({
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)])
        }),
    });


    ngOnInit() {
    }

    addNewUser() {
        console.log('submit');
    }
}
