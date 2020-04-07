import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class FirstLaunchGuard implements CanActivate {

    constructor(private router: Router,
        private platform: Platform,
        private nativeStorage: NativeStorage) {
    }

    canActivate(): Promise<boolean> {
        console.log('FirstLaunchGuard');
        return new Promise<boolean>(async resolve => {
            try {
                if (this.platform.is('cordova')) {
                    console.log('FirstLaunchGuard here 1 ');
                    await this.nativeStorage.getItem('isFirstLaunch');
                    return resolve(true);
                } else {
                    const firstLaunch = window.localStorage.getItem('isFirstLaunch');
                    if (!firstLaunch) {
                        // show help page if first launch
                        window.localStorage.setItem('isFirstLaunch', 'set');
                        this.router.navigate(['/help']);
                    }
                    return resolve(true);
                }
            } catch {
                try {
                    await this.nativeStorage.setItem('isFirstLaunch', true);
                    this.router.navigate(['/help']);
                } catch (error) {
                    console.error('Error storing item', error);
                    this.router.navigate(['/help']);
                }
            }
        });
    }
}
