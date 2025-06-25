import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { flatSelectedGuard } from './flat-selected.guard';

describe('flatSelectedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => flatSelectedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
