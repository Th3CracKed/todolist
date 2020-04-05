import {Component, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {ThemeServiceService} from '../theme-service.service';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-theme',
    templateUrl: './theme.component.html',
    styleUrls: ['./theme.component.scss'],
})
export class ThemeComponent implements OnInit {
    private theme: string;
    private onDestroy$ = new Subject<void>();

    constructor(private themeService: ThemeServiceService) {
    }

    ngOnInit() {
        const themeName = window.localStorage.getItem('themeName');
        console.log('=============================');
        console.log(themeName);
        if (themeName) {
            this.themeService.changeTheme(themeName);
        }
        this.themeService.currentTheme
            .pipe(takeUntil(this.onDestroy$)).subscribe((theme) => this.set(theme));
    }

    private set(theme: string) {
        return this.theme = theme;
    }
}
