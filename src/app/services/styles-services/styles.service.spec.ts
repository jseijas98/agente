/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StylesService } from './styles.service';

describe('Service: Styles', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StylesService]
    });
  });

  it('should ...', inject([StylesService], (service: StylesService) => {
    expect(service).toBeTruthy();
  }));
});
