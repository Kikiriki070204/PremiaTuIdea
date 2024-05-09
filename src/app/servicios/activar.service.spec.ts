import { TestBed } from '@angular/core/testing';

import { ActivarService } from './activar.service';

describe('ActivarService', () => {
  let service: ActivarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
