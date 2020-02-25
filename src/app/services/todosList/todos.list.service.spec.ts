import { TestBed, async } from '@angular/core/testing';

import { TodosListService } from './todos.list.service';
import { QueryFn, AngularFirestoreCollection, DocumentChangeType, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { of, Observable } from 'rxjs';
import { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Globals } from '../globals';

describe('TodoService', () => {
  let angularFireAuthSpy;
  let angularFirestoreSpy;

  angularFireAuthSpy = {
    user: of<Partial<User>>({
      uid: 'userId1',
    })
  }
  angularFirestoreSpy = {
    collection: (path: string, queryFn?: QueryFn): Partial<AngularFirestoreCollection> => {
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
    },
    doc: (path: string): Partial<AngularFirestoreDocument> => {
      return {
        update: <T>(data: Partial<T>): Promise<void> => new Promise((resolve, reject) => resolve()),
        delete: (): Promise<void> => new Promise((resolve, reject) => resolve())
      }
    },

  }
  beforeEach(async(() => {
    let globals = { currentUserId: 'userId'};
    TestBed.configureTestingModule({
      providers: [
        { provide:  AngularFireAuth, useValue: angularFireAuthSpy },
        { provide: AngularFirestore, useValue: angularFirestoreSpy },
        { provide: Globals, globals }
      ]
    });
  }));

  it('should be created', () => {
    const service: TodosListService = TestBed.get(TodosListService);
    expect(service).toBeTruthy();
  });
});
