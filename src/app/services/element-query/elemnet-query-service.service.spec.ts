import { TestBed } from '@angular/core/testing';

import { ElemnetQueryServiceService } from './elemnet-query-service.service';

describe('ElemnetQueryServiceService', () => {
  let service: ElemnetQueryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElemnetQueryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
