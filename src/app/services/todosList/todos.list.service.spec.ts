import { TestBed } from '@angular/core/testing';

import { TodosListService } from './todos.list.service';

describe('TodoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TodosListService = TestBed.get(TodosListService);
    expect(service).toBeTruthy();
  });
});
