import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  inject,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { GraphServiceService } from 'src/app/services/graph/graph-service.service';
import { environment } from 'src/environments/environment';
import StringUtils from '../../../../common/util/stringUtils';
import { ApiRegistry } from '../../../interfaces/model.apis/model.apiResgistry';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import * as XLSX from 'xlsx';
import { ExportExcelService } from 'src/app/services/export-excel/export-excel.service';

// Resto de tu código

@Component({
  selector: 'app-registrys-apis',
  templateUrl: './registrys-apis.component.html',
  styleUrls: ['./registrys-apis.component.css'],
})
export class RegistrysApisComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    private serv: GraphServiceService,
    private sseServiceService: SseServiceService,
    private dynamicFilterService: DynamicFilterService
  ) {}

  router = inject(Router);
  breadcrumbService = inject(BreadcrumbService);
  excel = inject(ExportExcelService);
  public breadcrumbs: { label: string; url: string }[] = [];
  filterValue: string = '';

  ngOnInit(): void {
    this.dynamicFilterService.dynamicFilter('filterValue');
  }

  downlaod(){
    this.excel.exportToExcel(this.dataSource,this.displayedColumns,this.apiName);
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.pageIndex=this.currentPageIndex
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
    this.breadcrumbService.agregarRuta(this.router.url,'historicos');
    this.breadcrumbs = this.breadcrumbService.obtenerBreadcrumbs();

    this.activateRouter.params.subscribe((params) => {
      this.Api_registry(params['id']);
    });

    this.sseApisRegistry();
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
    this.sseServiceService.closeEventSource();
    console.log('se cerro el sse');
  }

  protected legend1: string = 'tiempo de respuesta';
  protected legend2: string = 'ms';
  data: any[] = [];
  dataSource = new MatTableDataSource<any>(this.data);
  apiName: string;
  apiID: Number;
  dataGraph: Object[] = [];
  unsuscribe$ = new Subject<void>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  tableIsEmpty=true;

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
    this.dataGraph = this.serv.dataGraph_load_balancer(respose, this.apiName);
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.applyFilter();
  }

  getApisResgistryError(error: any) {
    console.error(error);
  }

  sseApisRegistry() {
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['id']);
    });
  }

  sseFuntion(index: any) {
    const http = `${environment.baseUrl}registry/application/${index}/apis`;
    this.sseServiceService
      .getDataFromServer(http)
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

    response.forEach((apiRegistry:ApiRegistry) => {
      datos.push({
        registry_id: apiRegistry.registry_id,
        apiId: apiRegistry.apiId,
        status: apiRegistry.status,
        health: apiRegistry.health,
        applicationId: apiRegistry.applicationId,
        label_app: apiRegistry.label_app,
        nameSpace: apiRegistry.nameSpace,
        consecutiveFailedTest: apiRegistry.consecutiveFailedTest,
        histFailedTest: apiRegistry.histFailedTest,
        lastTestDate: this.utils.formatDate(apiRegistry.lastTestDate),
        response_time: apiRegistry.response_time,
        consecutiveSuccessfulTest: apiRegistry.consecutiveSuccessfulTest,
        histSuccessfulTest: apiRegistry.histSuccessfulTest,
      });
      this.apiID = apiRegistry.applicationId;
      this.apiName = apiRegistry.label_app;
      this.dataGraph = this.serv.dataGraph_load_balancer(response, this.apiName);
    });
    if (datos.length > 0) {
      this.tableIsEmpty = false;
      this.dataSource = new MatTableDataSource<any>(datos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.currentPageIndex = this.paginator.pageIndex;
      this.applyFilter();

    }else{
      this.dataSource = new MatTableDataSource<any>([])
      this.dataSource.data = [{message:'Sin datos para mostrar'}];
      this.tableIsEmpty = false;
    }

  }
  currentPageIndex: number;

  Error(error: any) {
    console.log('error sse apis', error);
  }
}
