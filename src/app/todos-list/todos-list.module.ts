import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodosListPageRoutingModule } from './todos-list-routing.module';

import { TodosListPage } from './todos-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodosListPageRoutingModule
  ],
  declarations: [TodosListPage]
})
export class TodosListPageModule {}
