import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddListPageRoutingModule } from './addList-routing.module';

import { AddListPage } from './addList.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddListPageRoutingModule
  ],
  declarations: [AddListPage]
})
export class AddListPageModule {}
