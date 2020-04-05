import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeServiceService {

    currentTheme = new BehaviorSubject('background-default');

    constructor() {
    }


    changeTheme(SelectedThemeName: string) {
        // TODO change la valeur de localStorage avec setItem
        window.localStorage.setItem('themeName', SelectedThemeName);
        this.currentTheme.next(SelectedThemeName);
    }


}
