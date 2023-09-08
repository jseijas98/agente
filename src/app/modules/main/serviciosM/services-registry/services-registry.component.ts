import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import StringUtils from 'src/app/common/util/stringUtils';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
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
export class ServicesRegistryComponent implements OnInit, AfterViewInit {
  constructor(
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    private serv: GraphServiceService,
    private sseServiceService: SseServiceService,
    private dynamicFilterService: DynamicFilterService
  ){}

  router = inject(Router);

  breadcrumbService = inject(BreadcrumbService);
  public breadcrumbs: { label: string; url: string }[] = [];
  filterValue: string = '';
  protected legend1: string = 'tiempo de respuesta';
  protected legend2: string = 'ms';
  unsuscribe$ = new Subject<void>();
  data: any[] = [];
  dataGraph: Object[] = [];
  currentPageIndex: number;
  name_element: string;
  tableIsEmpty = true;


  ngOnDestroy() {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
    console.log('se cerro el sse');
    this.sseServiceService.closeEventSource();
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.pageIndex = this.currentPageIndex
    }
    localStorage.setItem('filterValue', this.filterValue);
    console.log('valor almacenado', this.filterValue);
  }

  onFilterInputChanged(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filterValue = inputValue ? inputValue.trim().toLowerCase() : '';
    this.applyFilter();
  }

  ngAfterViewInit(): void {
    this.sseServiceRegirty();
    console.log('Después de asignar this.paginator:', this.paginator);
  }

  ngOnInit(): void {
    this.breadcrumbService.agregarRuta(this.router.url,'historicos');
    this.breadcrumbs = this.breadcrumbService.obtenerBreadcrumbs();
    this.dynamicFilterService.dynamicFilter('filterValue')
  }
  
  sseServiceRegirty() {
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['id']);
    });
  }

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

    //configuración del dataSource
    dataSource = new MatTableDataSource<any>();

    //paginacion del las tablas
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;


  sseFuntion(index: any) {
    const httpApiLIst = `${environment.baseUrl}registry/application/${index}/service`;
    this.sseServiceService
      .getDataFromServer(httpApiLIst)
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe({
        next: this.Success.bind(this),
        error: this.Error.bind(this)
      });
  }

  Success(response: any) {

    let datos: any[] = [];
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

    this.dataGraph = [...this.serv.dataGraph_load_balancer(response,this.name_element)]
    console.log(this.dataGraph);
    console.log(datos);

    if (datos.length > 0) {
      this.dataSource = new MatTableDataSource<any>(datos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.currentPageIndex = this.paginator.pageIndex
      this.applyFilter();
      this.tableIsEmpty = false;
    } else {
      this.dataSource = new MatTableDataSource<any>([]);
      this.dataSource.data = [{ message: 'Sin datos para mostrar' }];
      this.tableIsEmpty = false;
    }
  }
  Error(error: any) {
    this.tableIsEmpty = true;
    console.log('error sse', error);
  }
  

}
