import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Task} from '../../models';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-list-sharing',
    templateUrl: './list-sharing.page.html',
    styleUrls: ['./list-sharing.page.scss'],
})
export class ListSharingPage implements OnInit {

    shareduser$: Observable<Task[]>;
    fakeListOfUsers = [{id: '0125545', email: 'todo@test.fr', canEdit: false}, {id: '81247654', email: 'canEdit@yes.fr', canEdit: true}];

    constructor() {
    }

    addSharedUser = new FormGroup({
        newSharedUser: new FormControl('', [Validators.required, Validators.minLength(1)])
    });

    ngOnInit() {
    }

    deleteSharedUser(id: any) {
        // todo
    }

    toogleCanEdit(user: { canEdit: boolean; id: string; email: string }) {
        // todo
    }

    addSharedUserToList() {
        // todo
    }
}
