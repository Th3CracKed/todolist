import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';
import {Platform} from '@ionic/angular';
import {FirebaseUtilsService} from 'src/app/services';
import {take} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FirstLaunchGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate(): boolean {
        try {
            const firstLaunch = window.localStorage.getItem('isFirstLaunch');
            if (!firstLaunch) {
                // show help page if first launch
                window.localStorage.setItem('isFirstLaunch', 'set');
                this.router.navigate(['/help']);
            }
            return true;
        } catch {
            return true;
        }
    }
}
