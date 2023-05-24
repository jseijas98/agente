import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnChanges,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GetApis } from '../../../interfaces/model.apis/model.getApis';
import StringUtils from '../../../../common/util/stringUtils';
import { environment } from 'src/environments/environment';
import { __values } from 'tslib';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/services/notification/notifications.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateparamsComponent } from 'src/app/components/modals/updateparams/updateparams.component';
import { RowAlertService } from 'src/app/services/row-alert/row-alert.service';
import { DeleteService } from 'src/app/services/deleteElement/delete.service';
import { Subject, takeUntil } from 'rxjs';
import { AppNameService } from 'src/app/services/app-name/app-name.service';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';

@Component({
  selector: 'app-api-list',
  templateUrl: './api-list.component.html',
  styleUrls: ['./api-list.component.css'],
})
export class ApiListComponent implements AfterViewInit, OnInit {
  @Input() dataIn: any;
  @Input() data: Array<any>;
  public index: string = 'apis';
  unsuscribe$ = new Subject<void>();
  registro: string = 'registros historicos';
  replicas: string = 'replicas del api ';
  appname: string;
  tableIsEmpty: boolean = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    public dialog: MatDialog,
    protected notificationSvc: NotificationsService,
    private snakbar: MatSnackBar,
    public rowAlertService: RowAlertService,
    public service: DeleteService,
    private appName: AppNameService,
    private sseServiceService: SseServiceService,
    private dynamicFilterService:DynamicFilterService
  ) {}

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

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
    localStorage.removeItem('filterValue');
  }

  ngAfterViewInit() {
    // this.activateRouter.params.subscribe((params) => {
    //   this.appName
    //     .getDataFromApplication(params['id'])
    //     .pipe(takeUntil(this.unsuscribe$))
    //     .subscribe((data) => (this.appname = data));
    // });
    // this.callApisData();
    this.activateRouter.params.subscribe((params) => {
      this.appName
        .getDataFromApi(params['id']).pipe(takeUntil(this.unsuscribe$))
        .subscribe((data) => (this.appname = data));
    });
    this.sseApisList();
  }

  //columnsas que se muestran
  displayedColumns: string[] = [
    'applId',
    'Id',
    'test_interval',
    'nameSpace',
    'triggerLow',
    'response_time',
    'triggerHigh',
    'label_app',
    'last_test',
    'status',
    'health',
    'registros',
    'replicas',
    'lowAlarm',
    'highAlarm',
    'editar',
    'select',
  ];

  //TODO: LISTO con sse
  //configuración del dataSource
  dataSource = new MatTableDataSource<any>();
  //paginacion del las tablas
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  callApisData() {
    this.activateRouter.params.subscribe((params) => {
      this.Api(params['id']);
    });
  }

  Api(index: number) {
    this.http
      .get<GetApis>(`${environment.baseUrl}list/application/${index}/apis`)
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe({
        next: this.getApisSuccess.bind(this),
        error: this.getApisError.bind(this),
        complete: () => console.log('completed'),
      });
  }

  getApisSuccess(respose: any) {
    let apisList: Array<GetApis> = respose;
    let data: any[] = [];
    apisList.forEach((api) => {
      data.push({
        Id: api.apiId,
        status: api.status,
        nameSpace: api.nameSpace,
        test_interval: api.testInterv,
        label_app: api.label_app,
        response_time: api.response_time,
        last_test: this.utils.formatDate(api.lastTestDate),
        health: api.health,
        applId: api.applicationId,
        triggerLow: api.lowTrigger,
        triggerHigh: api.highTrigger,
        lowAlarm: api.lowAlarm,
        highAlarm: api.highAlarm,
      });
      console.log('data',data);
    });
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.applyFilter();
  }

  getApisError(error: any) {
    console.error(error);
  }

  getApiReplica(api_id: any): void {
    this.router.navigateByUrl(`apis-replicas/${api_id}`);
  }

  ApiRegiistry(applId: any) {
    this.router.navigateByUrl(`apis-registry/${applId}`);
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
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('dialog:', result?._value.data);

      this.snakbar.open(
        result?._value.data
          ? 'se actualizaron los parametros'
          : 'Error en la actualizacion de parametros',
        'ACEPTAR'
      );
      this.callApisData();
    });
  }

  addItem(newItem: any) {
    newItem !== undefined
      ? console.log('data', newItem)
      : console.log('closed dialog without item update!');
    this.callApisData();
  }

  deleteData() {
    this.service.dataSource = this.dataSource;
    this.service.DeleteData('api');
      this.sseApisList();
  }

  sseApisList() {
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['id']);
    });
  }

  sseFuntion(index: any) {
    const httpApiLIst = `${environment.baseUrl}list/application/${index}/apis`;
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
    console.log(response);
    
    let datos: any[] = [];
    response.forEach((api: GetApis) => {
      datos.push({
        Id: api.apiId,
        status: api.status,
        nameSpace: api.nameSpace,
        test_interval: api.testInterv,
        label_app: api.label_app,
        response_time: api.response_time,
        last_test: this.utils.formatDate(api.lastTestDate),
        health: api.health,
        applId: api.applicationId,
        triggerLow: api.lowTrigger,
        triggerHigh: api.highTrigger,
        lowAlarm: api.lowAlarm,
        highAlarm: api.highAlarm,
      });
      this.activateRouter.params.subscribe((params) => {
        this.appName.nameApp(params['id']).subscribe((data) => (this.appname = data));
      });

    });

    console.log(datos);

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

  // sseFuntion2() {
  //   this.activateRouter.params.subscribe((params) => {
  //     let index = params['id'];
  //     const httpApiLIst = `${environment.Cisnerosip}list/application/${index}/apis`;
  //     this.sseServiceService
  //       .getDataFromServer(httpApiLIst)
  //       .pipe(takeUntil(this.unsuscribe$))
  //       .subscribe((data) => {
  //         let datos: any[] = [];
  //         data.forEach((api: GetApis) =>
  //           datos.push({
  //             Id: api.apiId,
  //             status: api.status,
  //             nameSpace: api.nameSpace,
  //             test_interval: api.testInterv,
  //             label_app: api.label_app,
  //             response_time: api.response_time,
  //             last_test: this.utils.formatearFecha(api.lastTestDate),
  //             health: api.health,
  //             applId: api.applicationId,
  //             triggerLow: api.lowTrigger,
  //             triggerHigh: api.highTrigger,
  //             lowAlarm: api.lowAlarm,
  //             highAlarm: api.highAlarm,
  //           })
  //         );
  //         console.log(datos);
  //         this.dataSource = new MatTableDataSource<any>(datos);
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       });
  //   });
  // }
}
