import { TestBed } from '@angular/core/testing';

import { EventStreamService } from './event-stream.service';

describe('EventStreamService', () => {
  let service: EventStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
