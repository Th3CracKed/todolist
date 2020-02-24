import { NgModule } from '@angular/core';

import { HelpPageRoutingModule } from './help-routing.module';

import { HelpPage } from './help.page';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    SharedModule,
    HelpPageRoutingModule
  ],
  declarations: [HelpPage]
})
export class HelpPageModule {}
