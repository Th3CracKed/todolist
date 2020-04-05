import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { MainPageRoutingModule } from './main-routing.module';
import { ClickStopPropagationDirective } from '../../directives/click-stop-propagation.directive';
import { MainPage } from './main.page';
import {ThemeComponent} from '../../themes/theme/theme.component';
@NgModule({
    imports: [
        SharedModule,
        MainPageRoutingModule
    ],
    exports: [
        ThemeComponent
    ],
    declarations: [
        MainPage,
        ClickStopPropagationDirective,
        ThemeComponent
    ]
})
export class MainPageModule {}
