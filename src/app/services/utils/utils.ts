import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    constructor(private toastController: ToastController){

    }

    async presentToast(msg: string, durationMs: number = 3000) {
        const toast = await this.toastController.create({
            message: msg,
            duration: durationMs
        });
        toast.present();
    }

    async presentErrorToast(msg: string, durationMs: number = 3000) {
        const toast = await this.toastController.create({
            message: msg,
            duration: durationMs,
            cssClass: "warning"
        });
        toast.present();
    }

}