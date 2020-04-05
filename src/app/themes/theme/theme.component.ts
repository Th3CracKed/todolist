import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ThemeServiceService } from '../theme-service.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-theme',
    templateUrl: './theme.component.html',
    styleUrls: ['./theme.component.scss'],
})
export class ThemeComponent implements OnInit {
    theme: string;
    private onDestroy$ = new Subject<void>();

    constructor(private themeService: ThemeServiceService) {
    }

    ngOnInit() {
        const themeName = window.localStorage.getItem('themeName');
        if (themeName) {
            this.themeService.changeTheme(themeName);
        }
        this.themeService.currentTheme
            .pipe(takeUntil(this.onDestroy$)).subscribe((theme) => this.theme = theme);
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

}
