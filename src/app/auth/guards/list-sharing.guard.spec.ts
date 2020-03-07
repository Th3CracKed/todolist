import { TestBed, inject } from '@angular/core/testing';

import { ListSharingGuard } from './list-sharing.guard';

describe('ListSharingGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListSharingGuard]
    });
  });

  it('should ...', inject([ListSharingGuard], (guard: ListSharingGuard) => {
    expect(guard).toBeTruthy();
  }));
});
