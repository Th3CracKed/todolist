import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeServiceService {

    currentTheme = new BehaviorSubject('default');

    constructor() {
    }


    changeTheme(SelectedThemeName: string) {
        // TODO change la valeur de localStorage avec setItem
        window.localStorage.setItem('themeName', 'default');
        this.currentTheme.next('background-' + SelectedThemeName);
    }
}
