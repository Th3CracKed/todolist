import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register/register.service';
import { UtilsService } from 'src/app/services/utils/utils';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  addUserForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    userName: new FormControl('', [Validators.required, Validators.minLength(3)], [this.authService.asyncUniqueUsernameValidation()]),
    email: new FormControl('', [Validators.required, Validators.email,
    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    passwords: new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)])
    }),
  });

  constructor(private router: Router,
    private registerService: RegisterService,
    private utilsService: UtilsService,
    private authService: AuthService) { }


  ngOnInit() {
  }

  signupUser() {
    const user: Partial<User> = {
      email: this.addUserForm.get('email').value,
      firstName: this.addUserForm.get('firstName').value,
      lastName: this.addUserForm.get('lastName').value,
      userName: this.addUserForm.get('userName').value
    }
    const password = this.addUserForm.get('passwords.password').value;
    this.registerService.signupUser(user, password)
      .then(() => {
        this.addUserForm.reset();
        this.router.navigateByUrl('');
      }).catch(this.utilsService.presentErrorToast)
  }
}
