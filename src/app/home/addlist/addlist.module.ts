import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddlistPageRoutingModule } from './addlist-routing.module';

import { AddlistPage } from './addlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddlistPageRoutingModule
  ],
  declarations: [AddlistPage]
})
export class AddlistPageModule {}
