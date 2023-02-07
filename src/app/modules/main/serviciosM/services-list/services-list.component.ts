import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import StringUtils from 'src/app/common/util/stringUtils';
import { ServicesList } from 'src/app/modules/interfaces/model.services/model.services-list';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css'],
})
export class ServicesListComponent implements OnInit {
  baseUrl = environment.baseUrl;

  index: number = 1;

  constructor(
    private http: HttpClient,
    private router: Router,
    public utils: StringUtils
  ) {}

  ngOnInit(): void {
    this.Api(this.index);
  }

  //columnsas que se muestran
  displayedColumns: string[] = [
    'applId',
    'services_id',
    'nameSpace',
    'test_interval',
    'label_app',
    'response_time',
    'last_test',
    'status',
    'health',
    'registros',
  ];

  data: any[] = [];

  juan: any[] = [];

  //configuración del dataSource
  dataSource = new MatTableDataSource<any>(this.data);

  //paginacion del las tablas
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  Api(index: number) {
    this.http
      .get<ServicesList>(`${this.baseUrl}list/application/${index}/service`)
      .subscribe({
        next: this.getServicesSuccess.bind(this),
        error: this.getServicesError.bind(this),
      });
  }

  registro: string = 'registros historicos';
  replicas: string = 'replicas del servicio ';

  getServicesSuccess(respose: any) {
    let serviceLIst: Array<ServicesList> = respose;

    serviceLIst.forEach((services) => {
      this.data.push({
        services_id: services.serviceId,
        status: services.status,
        nameSpace: services.nameSpace,
        test_interval: services.testInterv,
        label_app: services.labelApp,
        response_time: services.response_time,
        last_test: this.utils.convertDate(services.lastTestsDate),
        health: services.health,
        applId: services.applicationId,
      });
      console.log(this.data);
    });

    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  getServicesError(error: any) {
    console.error(error);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  rowGetApiId(services_id: number) {
    this.router.navigateByUrl(`services-replicas/${services_id}`);
  }

  ApiRegiistry(registry: any, services_id: any) {
    this.router.navigateByUrl(`services-registry/${services_id}`);
  }
}
