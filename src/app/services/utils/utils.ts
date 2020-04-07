import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    constructor(private toastController: ToastController) {

    }

    async presentToast(msg: string, durationMs: number = 3000) {
        const toast = await this.toastController.create({
            message: msg,
            duration: durationMs
        });
        toast.present();
    }

    async presentErrorToast(msg: any, durationMs: number = 3000) {
        const toast = await this.toastController.create({
            message: msg,
            duration: durationMs,
            cssClass: "warning"
        });
        toast.present();
        console.error(msg);
    }

    chainAllTasksInSeries = async <T>(tasksFactory: (() => Promise<T>)[]): Promise<T[]> => {
        return tasksFactory.reduce((promiseChain, currentTask) => {
            return promiseChain.then(chainResults =>
                currentTask().then(currentResult =>
                    [...chainResults, currentResult]
                )
            );
        }, Promise.resolve([]));
    }

}