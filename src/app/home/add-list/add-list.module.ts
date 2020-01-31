import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddlistPageRoutingModule } from './add-list-routing.module';

import { AddlistPage } from './add-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddlistPageRoutingModule
  ],
  declarations: [AddlistPage]
})
export class AddlistPageModule {}
