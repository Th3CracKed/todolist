import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { MainPageRoutingModule } from './main-routing.module';
import { ClickStopPropagationDirective } from '../../directives/click-stop-propagation.directive';
import { MainPage } from './main.page';
@NgModule({
  imports: [
    SharedModule,
    MainPageRoutingModule
  ],
  declarations: [
    MainPage,
    ClickStopPropagationDirective]
})
export class MainPageModule {}
