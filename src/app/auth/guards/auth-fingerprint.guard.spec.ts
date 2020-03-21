import { TestBed, inject } from '@angular/core/testing';

import { AuthFingerprintGuard } from './auth-fingerprint.guard';

describe('AuthFingerprintGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthFingerprintGuard]
    });
  });

  it('should ...', inject([AuthFingerprintGuard], (guard: AuthFingerprintGuard) => {
    expect(guard).toBeTruthy();
  }));
});
