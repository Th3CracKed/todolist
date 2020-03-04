import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  addUserForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email,
    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    passwords: new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)])
    }),
  });

  constructor(private afAuth: AngularFireAuth, private router: Router, private userService: UserService) { }


  ngOnInit() {
  }

  signupUser() {
    const email = this.addUserForm.get('email').value;
    const password = this.addUserForm.get('passwords.password').value;
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((firebaseUser) => {
        this.userService.add(
          {
            userId: firebaseUser.user.uid,
            firstName: this.addUserForm.get('firstName').value,
            lastName: this.addUserForm.get('lastName').value,
            userName: this.addUserForm.get('userName').value,
            email: this.addUserForm.get('email').value
          }
        ).then(() => {
          this.addUserForm.reset();
          this.router.navigateByUrl('');
        })
        // TODO error handling
      });
    // TODO error handling
  }
}
