import { TestBed } from '@angular/core/testing';

import { DoutoraService } from './doutora.service';

describe('DoutoraService', () => {
  let service: DoutoraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoutoraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
