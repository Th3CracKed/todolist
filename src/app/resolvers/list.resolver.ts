import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, empty } from 'rxjs';
import { SharedListService } from '../services';
import { take, catchError } from 'rxjs/operators';
import { TodoList } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ListResolver implements Resolve<Observable<TodoList[]>> {
    constructor(private sharedListService: SharedListService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TodoList[]> {
        return this.sharedListService.getAllUserList().pipe(take(1), catchError(_ => empty()));
    }
}