import { NgModule } from '@angular/core';

import { ProfilPageRoutingModule } from './profil-routing.module';

import { ProfilPage } from './profil.page';
import { SharedModule } from 'src/app/shared.module';
import {MainPageModule} from '../../home/main/main.module';

@NgModule({
    imports: [
        SharedModule,
        ProfilPageRoutingModule,
        MainPageModule
    ],
  declarations: [ProfilPage]
})
export class ProfilPageModule {}
