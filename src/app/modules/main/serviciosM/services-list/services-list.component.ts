import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import StringUtils from 'src/app/common/util/stringUtils';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import { UpdateparamsComponent } from 'src/app/components/modals/updateparams/updateparams.component';
import { ServiceInfo, ServicesList } from 'src/app/modules/interfaces/model.services/model.services-list';
import { AppNameService } from 'src/app/services/app-name/app-name.service';
import { DeleteService } from 'src/app/services/deleteElement/delete.service';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';
import { RowAlertService } from 'src/app/services/row-alert/row-alert.service';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css'],
})
export class ServicesListComponent implements AfterViewInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    public dialog: MatDialog,
    private snakbar: MatSnackBar,
    public rowAlertService: RowAlertService,
    public service: DeleteService,
    private appName: AppNameService,
    private sseServiceService: SseServiceService,
    private dynamicFilterService: DynamicFilterService
  ) { }

  //TODO: LISTO con sse 

  filterValue: string = '';
  currentPageIndex: number;

  breadcrumbService = inject(BreadcrumbService)
  public breadcrumbs: { label: string; url: string }[] = [];

//variables
  appname: string;
  unsuscribe$ = new Subject<void>();
  public index: string = 'service';
  registro: string = 'registros historicos';
  replicas: string = 'replicas del servicio ';
  baseUrl = environment.baseUrl;
  tableIsEmpty = true;


  ngOnDestroy() {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
    this.sseServiceService.closeEventSource();
    console.log('se cerro el sse');
  }

  ngAfterViewInit(): void {
    this.activateRouter.params.subscribe((params) => {
      this.appName
        .getDataFromApi(params['id']).pipe(takeUntil(this.unsuscribe$))
        .subscribe((data) => {
          this.appname = data
          this.breadcrumbService.agregarRuta('/','Dashboard');
          this.breadcrumbService.agregarRuta('/graph-app/' + params['id'], this.appname)
          this.breadcrumbService.agregarRuta('/services-list/' + params['id'], 'servicios')
          this.breadcrumbs = this.breadcrumbService.obtenerBreadcrumbs();

        }
        );
    });

    this.sseServiceList();
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

  ngOnInit(): void {
    console.log(this.breadcrumbService.obtenerBreadcrumbs());
    this.dynamicFilterService.dynamicFilter('filterValue');
    console.log('Después de asignar this.paginator:', this.paginator);
  }

  callServiceData() {
    this.activateRouter.params.subscribe((params) => {
      this.Service(params['id']);
    });
  }

  //columnsas que se muestran
  displayedColumns: string[] = [
    'applId',
    'Id',
    'nameSpace',
    'triggerLow',
    'test_interval',
    'label_app',
    'response_time',
    'triggerHigh',
    'last_test',
    'status',
    'health',
    'lowAlarm',
    'highAlarm',
    'select',
  ];

  //configuración del dataSource
  dataSource = new MatTableDataSource<any>();

  //paginacion del las tablas
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  Service(index: number) {
    this.http
      .get<ServicesList>(
        `${environment.baseUrl}list/application/${index}/service`
      )
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe({
        next: this.getServicesSuccess.bind(this),
        error: this.getServicesError.bind(this),
      });
  }

  getServicesSuccess(response: any) {
    let serviceLIst: Array<ServicesList> = response;
    let data: any[] = [];
    console.log('response', response);
    serviceLIst.forEach((services) => {
      data.push({
        Id: services.serviceId,
        status: services.status,
        nameSpace: services.nameSpace,
        test_interval: services.testInterv,
        label_app: services.labelApp,
        response_time: services.response_time,
        last_test: this.utils.formatDate(services.lastTestsDate),
        health: services.health,
        applId: services.applicationId,
        triggerLow: services.lowTrigger,
        triggerHigh: services.highTrigger,
        lowAlarm: services.lowAlarm,
        highAlarm: services.highAlarm,
        url: services.testUrl
      });
      console.log(data);
    });

    this.dataSource = new MatTableDataSource<any>(data);
    console.log(this.dataSource);
    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getServicesError(error: any) {
    console.error(error);
  }

  changeParameters(dataupdate: any) {
    this.http.post<any>(this.baseUrl + 'params', dataupdate).subscribe({
      next: this.updateResponse.bind(this),
      error: this.updateError.bind(this),
    });
  }

  updateResponse(response: boolean) {
    console.log('update response:', response);
  }

  updateError(error: any) {
    console.log(error);
  }

  open(row: any) {
    const dialogRef = this.dialog.open(UpdateparamsComponent, {
      disableClose: true,
      data: {
        item_id: row.Id,
        type: this.index,
        appid: row.applId,
        label: row.label_app,
        space: row.nameSpace,
        tlow: row.triggerLow,
        thigh: row.triggerHigh,
        testinterval: row.test_interval,
        testUrl: row.test_url
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('dialog:', result?._value.data);

      this.snakbar.open(
        result?._value.data
          ? 'actualización de parametro exitosa!'
          : 'Error en la actualizacion de parametros',
        'ACEPTAR'
      );
      this.callServiceData();
    });
  }

  ApiRegiistry(services_id: any) {
    this.router.navigateByUrl(`services-registry/${services_id}`);
  }

  getServicesReplica(api_id: any): void {
    this.router.navigateByUrl(`services-replicas/${api_id}`);
  }

  setParams(serviceInfo: ServiceInfo) {
    let details = JSON.stringify(serviceInfo)
    console.log('fasdsandsa', details);

    return btoa(details)
  }

  servicesDetails(serviceInfo: ServiceInfo) {
    let data = this.setParams(serviceInfo)
    console.log("data rows:", data);
    this.router.navigateByUrl(`servicesDetails/${data}`);
  };

  addItem(newItem: any) {
    newItem !== undefined
      ? console.log('data', newItem)
      : console.log('closed dialog without item update!');
    this.callServiceData();
  }

  deleteData() {
    // this.service.dataSource = this.dataSource;
    // this.service.DeleteData(this.index);
    // this.sseServiceList();
  }

  sseServiceList() {
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['id']);
    });
  }

  sseFuntion(index: any) {
    const httpApiLIst = `${environment.baseUrl}list/application/${index}/service`;
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
    response.forEach((services: ServicesList) => {
      datos.push({
        Id: services.serviceId,
        status: services.status,
        nameSpace: services.nameSpace,
        test_interval: services.testInterv,
        label_app: services.labelApp,
        response_time: services.response_time,
        last_test: this.utils.formatDate(services.lastTestsDate),
        health: services.health,
        applId: services.applicationId,
        triggerLow: services.lowTrigger,
        triggerHigh: services.highTrigger,
        lowAlarm: services.lowAlarm,
        highAlarm: services.highAlarm,
        url: services.testUrl
      });
    });
    console.log(datos);

    if (datos.length > 0) {
      this.tableIsEmpty = false;
      this.dataSource = new MatTableDataSource<any>(datos);
      console.log(this.dataSource);
      
      this.dataSource.paginator = this.paginator;
      console.log(this.paginator);
      
      this.dataSource.sort = this.sort;
      this.currentPageIndex = this.paginator.pageIndex;
      this.applyFilter();


    } else {
      this.dataSource = new MatTableDataSource<any>([]);
      this.dataSource.data = [{ message: 'Sin datos para mostrar' }];
      this.tableIsEmpty = false;
    }
  }
 

  Error(error: any) {
    console.log('error sse', error);
  }
}
