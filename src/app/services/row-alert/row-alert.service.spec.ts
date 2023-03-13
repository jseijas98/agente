import { TestBed } from '@angular/core/testing';

import { RowAlertService } from './row-alert.service';

describe('RowAlertService', () => {
  let service: RowAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RowAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
