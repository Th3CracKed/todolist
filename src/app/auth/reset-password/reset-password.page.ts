import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils/utils';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.page.html',
    styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
    userLogin = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
    });

    constructor(public alertController: AlertController,
        private afAuth: AngularFireAuth,
        private utilsService: UtilsService) {
    }

    ngOnInit() {
    }

    reset() {
        const email = this.userLogin.get('email').value
        this.presentAlertConfirm(email);
    }


    private async presentAlertConfirm(email: string) {
        const alert = await this.alertController.create({
            header: 'Confirm reset password!',
            message: 'We will send you an <strong>email with a link</strong> to reset your password.',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Cancel');
                    }
                }, {
                    text: 'Reset',
                    handler: () => {
                        console.log('Confirm Okay reset Password');
                        return this.afAuth.auth.sendPasswordResetEmail(email)
                            .then(() => {
                                this.utilsService.presentToast('An email with link to reset password is sent'); 
                                this.userLogin.reset();
                            })
                            .catch(this.utilsService.presentErrorToast);
                    }
                }
            ]
        });

        await alert.present();
    }
}
