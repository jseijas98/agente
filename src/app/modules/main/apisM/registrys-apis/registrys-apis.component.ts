import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment-timezone';
import { Multi, Series } from 'src/app/modules/interfaces/multi';
import { GraphServiceService } from 'src/app/services/graph/graph-service.service';
import { environment } from 'src/environments/environment';
import StringUtils from '../../../../common/util/stringUtils';
import { ApiRegistry } from '../../../interfaces/model.apis/model.apiResgistry';

@Component({
  selector: 'app-registrys-apis',
  templateUrl: './registrys-apis.component.html',
  styleUrls: ['./registrys-apis.component.css'],
})
export class RegistrysApisComponent implements OnInit, AfterViewInit{
  constructor(
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    private router: Router,
    private serv: GraphServiceService
  ) {

  }
  ngAfterViewInit(): void {
   this.activateRouter.params.subscribe((params) => {
      this.Api_registry(params['id']);
    });
  }

  ngOnInit(): void {

  }



  displayedColumns: string[] = [
    'registry_id',
    'apiId',
    'status',
    'health',
    'applicationId',
    'label_app',
    'nameSpace',
    'consecutiveFailedTest',
    'histFailedTest',
    'lastTestDate',
    'response_time',
    'consecutiveSuccessfulTest',
    'histSuccessfulTest',
  ];

  data: any[] = [];
  dataSource = new MatTableDataSource<any>(this.data);
  apiName: string;
  apiID: Number;
  dataGraph: Object[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  Api_registry(index: number) {
    this.http
      .get<ApiRegistry>(
        `${environment.baseUrl}registry/application/${index}/apis`
      )
      .subscribe({
        next: this.getRegistryApisSuccess.bind(this),
        error: this.getApisResgistryError.bind(this),
      });
  }

  getRegistryApisSuccess(respose: any) {
    let apisRegistry: Array<ApiRegistry> = respose;

    apisRegistry.forEach((apiRegistry) => {
      this.data.push({
        registry_id: apiRegistry.registry_id,
        apiId: apiRegistry.apiId,
        status: apiRegistry.status,
        health: apiRegistry.health,
        applicationId: apiRegistry.applicationId,
        label_app: apiRegistry.label_app,
        nameSpace: apiRegistry.nameSpace,
        consecutiveFailedTest: apiRegistry.consecutiveFailedTest,
        histFailedTest: apiRegistry.histFailedTest,
        lastTestDate: this.utils.formatearFecha(apiRegistry.lastTestDate),
        response_time: apiRegistry.response_time,
        consecutiveSuccessfulTest: apiRegistry.consecutiveSuccessfulTest,
        histSuccessfulTest: apiRegistry.histSuccessfulTest,
      });

      this.apiID = apiRegistry.applicationId;
      this.apiName = apiRegistry.label_app;

      console.log(apiRegistry.lastTestDate);
    });

    this.dataGraph = this.serv.dataGraph(respose, this.apiName);

    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  getApisResgistryError(error: any) {
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
