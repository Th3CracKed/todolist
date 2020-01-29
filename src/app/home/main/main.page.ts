import {Component, OnInit} from '@angular/core';
import {ActionSheetController} from '@ionic/angular';

@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

    constructor(public actionSheetController: ActionSheetController) {
    }

    ngOnInit() {
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
