import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-help',
    templateUrl: './help.page.html',
    styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
    helpPages = [{
        image: 'todoapp',
        title: 'Welcome',
        desc: 'This todolist app is perfect to increase your productivity.'
    },
        {
            image: 'delete_tuto2',
            title: 'Delete a task',
            desc: 'Swipe to delete a task'
        },
        {
            image: 'sharingbtn_tuto',
            title: 'Share your lists',
            desc: 'Share and synchronize a list with one of your friends.'
        },
        {
            image: 'profil_picture',
            title: 'Customize your account',
            desc: 'Add a profile picture by using the camera.'
        },
        {
            image: 'finger_tuto2',
            title: 'Quick reconnection',
            desc: 'If you close the application and your fingerprint is configured, you can re-authenticate with one click.'
        }];

    constructor(private router: Router) {
    }

    ngOnInit() {}

}
