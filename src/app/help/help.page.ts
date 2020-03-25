import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-help',
    templateUrl: './help.page.html',
    styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
    helpPages = [{
        image: 'survey',
        title: 'Bienvenue sur TODO APP',
        desc: 'Ce gestionnaire de tâches est parfait pour améliorer votre productivité.'
    },
        {
            image: 'delete_tuto2',
            title: 'Supprimez une tâche',
            desc: 'Balayez pour supprimer une tâche.'
        },
        {
            image: 'sharingbtn_tuto',
            title: 'Partagez vos listes',
            desc: 'Partagez et synchronisez une liste avec vos amis.'
        },
        {
            image: 'profil_picture',
            title: 'Personnalisez votre profil',
            desc: 'Ajoutez une photo à votre profil avec la camera.'
        },
        {
            image: 'finger_tuto2',
            title: 'Reconnexion rapide',
            desc: 'Si vous fermez l\'application et votre empreinte est configurée, vous pouvez vous réauthentifier en un clic.'
        }];

    constructor(private router: Router) {
    }

    ngOnInit() {}

}
