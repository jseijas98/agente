/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExportExcelService } from './export-excel.service';

describe('Service: ExportExcel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportExcelService]
    });
  });

  it('should ...', inject([ExportExcelService], (service: ExportExcelService) => {
    expect(service).toBeTruthy();
  }));
});
