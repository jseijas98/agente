import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import StringUtils from 'src/app/common/util/stringUtils';
import { ServicesRegistry } from 'src/app/modules/interfaces/model.services/model.services-registry';
import { GraphServiceService } from 'src/app/services/graph/graph-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-services-registry',
  templateUrl: './services-registry.component.html',
  styleUrls: ['./services-registry.component.css'],
})
export class ServicesRegistryComponent implements AfterViewInit {
  constructor(
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    private serv: GraphServiceService
  ) {
    
  }
  ngAfterViewInit(): void {
  this.activateRouter.params.subscribe((params) => {
      this.Service_registry(params['id']);
    });
  }

  ngOnInit(): void {}

  displayedColumns: string[] = [
    'registry_id',
    'servicesId',
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
  dataGraph: Object[] = [];
  name_element: string

  dataSource = new MatTableDataSource<any>(this.data);

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  Service_registry(index: number) {
    this.http
      .get<ServicesRegistry>(
        `${environment.baseUrl}registry/application/${index}/service`
      )
      .subscribe({
        next: this.getRegistryApisSuccess.bind(this),
        error: this.getApisResgistryError.bind(this),
      });
  }

  getRegistryApisSuccess(respose: any) {
    let ServicesRegistry: Array<ServicesRegistry> = respose;

    ServicesRegistry.forEach((servicesRegistry) => {
      this.data.push({
        registry_id: servicesRegistry.registry_id,
        servicesId: servicesRegistry.serviceId,
        status: servicesRegistry.status,
        health: servicesRegistry.health,
        applicationId: servicesRegistry.applicationId,
        label_app: servicesRegistry.label_app,
        nameSpace: servicesRegistry.nameSpace,
        consecutiveFailedTest: servicesRegistry.consecutiveFailedTest,
        histFailedTest: servicesRegistry.histFailedTest,
        lastTestDate: this.utils.formatDate(servicesRegistry.lastTestDate),
        response_time: servicesRegistry.response_time,
        consecutiveSuccessfulTest: servicesRegistry.consecutiveSuccessfulTest,
        histSuccessfulTest: servicesRegistry.histSuccessfulTest,
      });
      this.name_element = servicesRegistry.label_app
    });
    console.log(this.data);
    this.dataGraph = this.serv.dataGraph_load_balancer(respose,this.name_element)
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
