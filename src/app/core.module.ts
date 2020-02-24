import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { Globals } from './services/globals';

@NgModule({
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuthGuard,
    Globals,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ]
})
export class CoreModule {}
