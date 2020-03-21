import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { Platform } from '@ionic/angular';
import { FirebaseUtilsService } from 'src/app/services';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthFingerprintGuard implements CanActivate {

  constructor(private faio: FingerprintAIO,
    private platform: Platform,
    private firebaseUtilsService: FirebaseUtilsService,
    private router: Router) { }

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
          const isFirstLogin = window.localStorage.getItem('first_login');
          if (!!isFirstLogin) {
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
