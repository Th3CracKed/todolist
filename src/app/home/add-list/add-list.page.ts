import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TodosListService} from '../../services';
import {FormGroup, FormControl, Validators} from '@angular/forms';


@Component({
    selector: 'app-add-list',
    templateUrl: './add-list.page.html',
    styleUrls: ['./add-list.page.scss'],
})
export class AddlistPage implements OnInit {

    addListForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(1)])
    });

    constructor(private todosListService: TodosListService,
                private router: Router) {
    }

    ngOnInit() {
    }

    addList() {
        this.todosListService.add( {title: this.addListForm.get('title').value});
        this.addListForm.reset();
        this.router.navigate(['']); // TODO continue filling the form, TODO show toast informing user that List is created
    }

    resetForm() {
        this.addListForm.reset();
    }

}
