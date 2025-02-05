import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        LoginPageRoutingModule
    ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
