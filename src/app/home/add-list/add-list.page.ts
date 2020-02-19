import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TodoList} from '../../models/todoList';
import {TodosListService} from '../../services';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { Globals } from '../../services';


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
                private router: Router,
                private globals: Globals) {
    }

    ngOnInit() {
    }

    addList() {
        let todoList: TodoList = {title: this.addListForm.get('title').value, userId: this.globals.currentUserId};
        this.todosListService.add(todoList);
        this.addListForm.reset();
        this.router.navigate(['']); // TODO continue filling the form, TODO show toast informing user that List is created
    }

    resetForm() {
        this.addListForm.reset();
    }

}
