import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import StringUtils from 'src/app/common/util/stringUtils';
import { PicRegistry } from 'src/app/modules/interfaces/model.pic/model.pic-registry';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pic-registry',
  templateUrl: './pic-registry.component.html',
  styleUrls: ['./pic-registry.component.css']
})
export class PicRegistryComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute
  ) {
    this.activateRouter.params.subscribe((params) => {
      this.PIC_registry(params['id']);
    });
  }

  ngOnInit(): void {}

  displayedColumns: string[] = [
    'registry_id',
    'PicId',
    'status',
    'applicationId',
    'description',
    'consecutiveFailedTest',
    'histFailedTest',
    'lastTestDate',
    'response_time',
    'consecutiveSuccessfulTest',
    'histSuccessfulTest',
  ];

  data: any[] = [];

  baseUrl = environment.baseUrl;

  dataSource = new MatTableDataSource<any>(this.data);

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  PIC_registry(index: number) {
    this.http
      .get<PicRegistry>(
        `${this.baseUrl}registry/application/${index}/integration`
      )
      .subscribe({
        next: this.getRegistryPicSuccess.bind(this),
        error: this.getPicResgistryError.bind(this),
      });
  }

  getRegistryPicSuccess(respose: any) {
    let PicRegistry: Array<PicRegistry> = respose;

    PicRegistry.forEach((PicRegistry) => {
      this.data.push({
        registry_id: PicRegistry.registry_id,
        PicId: PicRegistry.integrationId,
        status: PicRegistry.status,
        applicationId: PicRegistry.applicationId,
        description: PicRegistry.description,
        consecutiveFailedTest: PicRegistry.consecutiveFailedTest,
        histFailedTest: PicRegistry.histFailedTest,
        lastTestDate: this.utils.convertDate(PicRegistry.lastTestDate),
        response_time: PicRegistry.response_time,
        consecutiveSuccessfulTest: PicRegistry.consecutiveSuccessfulTest,
        histSuccessfulTest: PicRegistry.histSuccessfulTest,
      });
    });
    console.log(this.data);
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  getPicResgistryError(error: any) {
    console.error(error);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
