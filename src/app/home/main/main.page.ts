import {Component, OnInit} from '@angular/core';
import {ActionSheetController, AlertController, ToastController} from '@ionic/angular';

@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

    constructor(public actionSheetController: ActionSheetController, public toastController: ToastController, public alertController: AlertController) {
    }

    ngOnInit() {
    }

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Nouvelle liste créée',
            duration: 2000
        });
        toast.present();
    }


    async presentAlertConfirm() {
        const alert = await this.alertController.create({
            header: 'Confirmation!',
            message: 'Supprimer la note <strong>liste Name Here</strong> ?',
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Supprimer',
                    handler: () => {
                        console.log('Confirm Okay');
                    }
                }
            ]
        });
        await alert.present();
    }

    // Quand l'utilisateur clique sur settings
    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Actions',
            buttons: [{
                text: 'Supprimer',
                role: 'destructive',
                icon: 'trash',
                handler: () => {
                    console.log('Delete clicked');
                    this.presentAlertConfirm();
                }
            }, {
                text: 'Partager',
                icon: 'person-add',
                handler: () => {
                    console.log('Partager clicked');
                }
            }, {
                text: 'Epingler',
                icon: 'pin',
                handler: () => {
                    console.log('tâche epinglé');
                }
            }, {
                text: 'Annuler',
                icon: 'close',
                role: 'cancel',
                handler: () => {
                    console.log('Annuler clicked');
                }
            }]
        });
        await actionSheet.present();
    }

    openList() {
        console.log('route to new page');
    }
}
