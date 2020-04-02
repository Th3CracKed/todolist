import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { firebaseConfig } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { CoreModule } from './core.module';
import { AngularFireDatabaseModule } from '@angular/fire/database';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AngularFireMessagingModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
