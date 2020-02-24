import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AddlistPageRoutingModule } from './add-list-routing.module';

import { AddlistPage } from './add-list.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AddlistPageRoutingModule
  ],
  declarations: [AddlistPage]
})
export class AddlistPageModule {}
