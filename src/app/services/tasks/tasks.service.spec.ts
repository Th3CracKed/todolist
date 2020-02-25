import { TestBed } from '@angular/core/testing';

import { TasksService } from './tasks.service';
import { QueryFn, AngularFirestoreCollection, DocumentChangeType, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';

describe('TaskService', () => {
  let angularFirestoreSpy = jasmine.createSpyObj('AngularFirestoreSpy', ['collection', 'doc']);
  angularFirestoreSpy.collection.and.callFake((path: string, queryFn?: QueryFn): Partial<AngularFirestoreCollection> => {
    return {
      stateChanges: (events?: DocumentChangeType[]): Observable<any[]> => {
        return of([{
          payload: {
            doc: {
              id: 'Todo1',
              title: 'title',
              userId: 'userId',
            }
          },
          type: 'added'
        }])
      },
      add: <T>(data: T): Promise<any> => new Promise((resolve, reject) => resolve())
    }
  });
  angularFirestoreSpy.doc.and.callFake((path: string): Partial<AngularFirestoreDocument> => {
    return {
      update: <T>(data: Partial<T>): Promise<void> => new Promise((resolve, reject) => resolve()),
      delete: (): Promise<void> => new Promise((resolve, reject) => resolve())
    }
  });
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{ provide: AngularFirestore, useValue: angularFirestoreSpy }]
  }));

  it('should be created', () => {
    const service: TasksService = TestBed.get(TasksService);
    expect(service).toBeTruthy();
  });
});
