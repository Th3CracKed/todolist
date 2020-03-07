import { Injectable } from '@angular/core';
import { CanLoad, UrlSegment, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseUtilsService, TodosListService } from 'src/app/services';
import { flatMap, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListSharingGuard implements CanLoad {

  constructor(private firebaseUtilsService: FirebaseUtilsService, private todosListService: TodosListService) { }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    const listId = segments[1]['path'];
    return this.firebaseUtilsService.getCurrentUser()
      .pipe(
        take(1),
        flatMap(user => this.todosListService.getOne(listId)
          .pipe(
            take(1),
            map(todoList => user.userId === todoList.userId)
          ))
      );
  }

}
