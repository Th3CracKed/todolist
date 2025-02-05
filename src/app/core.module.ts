import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { Camera } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { ImageResizer } from '@ionic-native/image-resizer/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx'
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@NgModule({
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuthGuard,
    Camera,
    ImagePicker,
    Base64,
    ImageResizer,
    GooglePlus,
    FirebaseDynamicLinks,
    FingerprintAIO,
    FirebaseX,
    Facebook,
    Vibration,
    NativeStorage,
    TextToSpeech,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ]
})
export class CoreModule { }
