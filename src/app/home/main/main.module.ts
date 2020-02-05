import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';
import { ClickStopPropagationDirective } from '../../directives/click-stop-propagation.directive';
import { MainPage } from './main.page';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPageRoutingModule
  ],
  declarations: [MainPage,
    ClickStopPropagationDirective],
    providers: [AngularFireAuthGuard]
})
export class MainPageModule {}
