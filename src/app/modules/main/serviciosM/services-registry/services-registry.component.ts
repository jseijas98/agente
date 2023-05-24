import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import StringUtils from 'src/app/common/util/stringUtils';
import { ServicesRegistry } from 'src/app/modules/interfaces/model.services/model.services-registry';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';
import { GraphServiceService } from 'src/app/services/graph/graph-service.service';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
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
    private serv: GraphServiceService,
    private sseServiceService: SseServiceService,
    private dynamicFilterService:DynamicFilterService
  ) {}


  filterValue: string = '';

  applyFilter() {
    this.dataSource.filter = this.filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.pageIndex=this.currentPageIndex
    }
    localStorage.setItem('filterValue', this.filterValue);
    console.log('valor almacenado',this.filterValue);

  }
  onFilterInputChanged(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filterValue = inputValue ? inputValue.trim().toLowerCase() : '';
    this.applyFilter();
  }

  ngOnInit(): void {
this.dynamicFilterService.dynamicFilter('filterValue')
  }


  ngOnDestroy() {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
  }

  ngAfterViewInit(): void {
    // this.activateRouter.params.subscribe((params) => {
    //   this.Service_registry(params['id']);
    // });
    this.sseServiceRegirty();
  }

  //TODO: LISTO con sse
  //pointer grph info
  protected legend1: string = 'tiempo de respuesta';
  protected legend2: string = 'ms';
  //
  unsuscribe$ = new Subject<void>();
  //
  data: any[] = [];
  dataGraph: Object[] = [];
  name_element: string;
  public dataSource = new MatTableDataSource<any>(this.data);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  tableIsEmpty=false;

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
    console.log('response', respose);

    if(respose){
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
      this.name_element = servicesRegistry.label_app;
    });
    console.log(this.data);
    this.dataGraph = this.serv.dataGraph_load_balancer(
      respose,
      this.name_element
    );
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    }
    return console.log('no hay nada compa');
    
  }

  getApisResgistryError(error: any) {
    console.error(error);
  }

  sseServiceRegirty() {
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['id']);
    });
  }

  sseFuntion(index: any) {
    const httpApiLIst = `${environment.baseUrl}registry/application/${index}/service`;
    this.sseServiceService
      .getDataFromServer(httpApiLIst)
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe({
        next: this.Success.bind(this),
        error: this.Error.bind(this),
        complete: () => console.log('completed'),
      });
  }

  Success(response: any) {
    let datos: any[] = [];    
    console.log(response);
    
    if(response.statusCodeValue1 == 200){
    response.forEach((servicesRegistry: ServicesRegistry) => {
      datos.push({
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
      this.name_element = servicesRegistry.label_app;
    });
    console.log('datos',datos);

    if (datos.length > 0) {
      console.log('cayo en data');
      
      this.tableIsEmpty = false;
      this.dataSource = new MatTableDataSource<any>(datos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.currentPageIndex = this.paginator.pageIndex;
      this.applyFilter();

    }else{
      console.log('cayo en data vacia');
      this.dataSource = new MatTableDataSource<any>([])
      this.dataSource.data = [{message:'Sin datos para mostrar'}];
      this.tableIsEmpty = true;
    }
  }
  return this.tableIsEmpty=true;
  }
  currentPageIndex: number;

  Error(error: any) {
    this.tableIsEmpty = true;
    console.log('error sse', error);
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
}
