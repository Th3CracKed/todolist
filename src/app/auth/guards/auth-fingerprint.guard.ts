import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { Platform } from '@ionic/angular';
import { FirebaseUtilsService } from 'src/app/services';
import { take } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthFingerprintGuard implements CanActivate {

  constructor(private faio: FingerprintAIO,
    private platform: Platform,
    private firebaseUtilsService: FirebaseUtilsService,
    private router: Router,
    private nativeStorage: NativeStorage) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>(async resolve => {
      try {
        const user = await this.firebaseUtilsService.getCurrentUser().pipe(take(1)).toPromise();
        if (!user) {
          this.router.navigate(['/login']);
          resolve(false);
          return;
        }
        if (this.platform.is('cordova')) {

          const isFirstLogin = await this.nativeStorage.getItem('first_login');
          if (isFirstLogin) {
            resolve(true);
            return;
          }
          const isFingerprintAvailable = await this.faio.isAvailable();
          if (!isFingerprintAvailable) {
            resolve(true);
            return;
          }
          const isAuthorized = await this.faio.show({ title: 'Security check', disableBackup: true });
          if (!!isAuthorized) {
            try {
              await this.nativeStorage.setItem('first_login', true);
            } catch (error) {
              console.error('Error storing item', error);
            }
            resolve(true);
          } else {
            this.router.navigate(['/login']);
            resolve(false);
          }
        } else {
          resolve(true);
        }
      } catch {
        this.router.navigate(['/login']);
        resolve(false);
      }
    });
  }
}
