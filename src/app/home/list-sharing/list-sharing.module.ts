import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListSharingPageRoutingModule } from './list-sharing-routing.module';

import { ListSharingPage } from './list-sharing.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListSharingPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [ListSharingPage]
})
export class ListSharingPageModule {}
