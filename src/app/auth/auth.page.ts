import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(public afAuth: AngularFireAuth, private router: Router) {
  }

  ngOnInit() {
  }
  
  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(()=> this.router.navigate(['']));
  }
  logout() {
    this.afAuth.auth.signOut();
  }

}
