import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  currentMessage = new BehaviorSubject(null);

  constructor(
    private db: AngularFirestore,
    private platform: Platform,
    private firebaseNative: FirebaseX,
    private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }

  /**
   * request permission for notification from firebase cloud messaging
   * 
   * @param userId userId
   */
  async requestPermission(userId) {
    if (this.platform.is('cordova')) {
      const token = await this.firebaseNative.getToken();
      this.updateToken(userId, token);
    } else {
      this.angularFireMessaging.requestToken.subscribe(
        token => this.updateToken(userId, token),
        err => console.error('Unable to get permission to notify.', err)
      );
    }
  }

  /**
   * update token in firebase database
   * 
   * @param userId userId as a key 
   * @param token token as a value
   */
  private updateToken(userId, token) {
    return this.db.collection<{ value: string }>('/fcmTokens').doc(userId).set({ value: token });
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    if (this.platform.is('cordova')) {
      this.firebaseNative.onMessageReceived()
        .subscribe(payload => this.currentMessage.next(payload)
          , err => console.log(err));
    } else {
      this.angularFireMessaging.messages
        .subscribe(payload => this.currentMessage.next(payload)
          , err => console.log(err));
    }
  }
}
