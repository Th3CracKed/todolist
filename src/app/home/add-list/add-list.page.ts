import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TodosListService } from '../../services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils/utils';


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
        private utils: UtilsService) {
    }

    ngOnInit() {
    }

    addList() {
        this.todosListService.add(this.addListForm.get('title').value)
            .subscribe(list => {
                this.addListForm.reset();
                this.utils.presentToast('List Created Successfully', 1000);
                this.router.navigate([`list/${list.id}`]);
            }, err => this.utils.presentErrorToast(err));
    }

    resetForm() {
        this.addListForm.reset();
    }

}
