import { TestBed } from '@angular/core/testing';

import { FormMessageService } from './form-message.service';

describe('FormMessageService', () => {
  let service: FormMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
