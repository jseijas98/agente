import { HttpClient } from '@angular/common/http';
import {AfterViewInit,Component,inject, Input,OnInit,ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GetApis, ResponseModel } from '../../../interfaces/model.apis/model.getApis';
import StringUtils from '../../../../common/util/stringUtils';
import { environment } from 'src/environments/environment';
import { __values } from 'tslib';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/services/notification/notifications.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateparamsComponent } from 'src/app/components/modals/updateparams/updateparams.component';
import { RowAlertService } from 'src/app/services/row-alert/row-alert.service';
import { DeleteService, PayloadType } from 'src/app/services/deleteElement/delete.service';
import { Subject, takeUntil } from 'rxjs';
import { AppNameService } from 'src/app/services/app-name/app-name.service';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';

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


  breadcrumbService = inject(BreadcrumbService)
  public breadcrumbs: { label: string; url: string }[] = [];

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
    private dynamicFilterService: DynamicFilterService
  ) { }

  filterValue: string = '';
  currentPageIndex: number;

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
    this.dynamicFilterService.dynamicFilter('filterValue')
  }

  ngOnDestroy() {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
    localStorage.removeItem('filterValue');
    this.sseServiceService.closeEventSource();
  }

  ngAfterViewInit() {
    this.activateRouter.params.subscribe((params) => {
      this.appName
        .getDataFromApi(params['id']).pipe(takeUntil(this.unsuscribe$))
        .subscribe((data) => {
          this.appname = data
          this.breadcrumbService.agregarRuta('/', 'Dashboard');
          this.breadcrumbService.agregarRuta('/graph-app/' + params['id'], this.appname)
          this.breadcrumbService.agregarRuta('/apis-list/' + params['id'], 'apis')
          this.breadcrumbs = this.breadcrumbService.obtenerBreadcrumbs();
        });
    });
    this.sseApisList();
  }

  //columnsas que se muestran
  displayedColumns: string[] = [
    'applicationId',
    'apiId',
    'testInterv',
    'nameSpace',
    'response_time',
    'criticalTrigger',
    'label_app',
    'last_test',
    'status',
    'health',
    'registros',
    'replicas',
    'warningAlarm',
    'warningTrigger',
    'editar',
    'select',
  ];

  //configuración del dataSource
  dataSource = new MatTableDataSource<any>();
  //paginacion del las tablas
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  setParams(apis: GetApis) {
    console.log(apis);
    let details = JSON.stringify(apis)
    console.log('fasdsandsa', details);
    return btoa(details)
  }

  apiDetails(apis: GetApis) {
    let data = this.setParams(apis)
    console.log("data rows:", data);
    this.router.navigateByUrl(`apisDetails/${data}`);
  };

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
        tlow: row.warningTrigger,
        thigh: row.criticalTrigger,
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
      this.sseApisList();
    });
  }

  addItem(newItem: any) {
    newItem !== undefined
      ? console.log('data', newItem)
      : console.log('closed dialog without item update!');
    this.sseApisList();
  }

  deleteData() {
    this.service.dataSource = this.dataSource;
    this.service.DeleteData(PayloadType["API"]);
    this.sseApisList();
  }

  sseApisList() {
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['id']);
    });
  }

  sseFuntion(index: any) {
    const httpApiLIst = `http://180.183.170.56:30446/monitor-agent-service/v2/get/all/${index}/${PayloadType.API}`;
    this.sseServiceService
      .getDataFromServer(httpApiLIst)
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe({
        next: this.Success.bind(this),
        error: this.Error.bind(this),
        complete: () => console.log('completed'),
      });
  }

  Success(response: ResponseModel) {
    console.log(response);  
    const apiDataList: Array<GetApis> = response.data.map((api: GetApis) => this.mapApiData(api));
    this.handleApiData(apiDataList);
  }
  
  private mapApiData(api: GetApis): GetApis {
    return {
      apiId: api.apiId,
      status: api.status,
      nameSpace: api.nameSpace,
      testInterv: api.testInterv,
      label_app: api.label_app,
      response_time: api.response_time,
      lastTestDate: this.utils.formatDate(api.lastTestDate),
      health: api.health,
      applicationId: api.applicationId,
      warningTrigger: api.warningTrigger,
      criticalTrigger: api.criticalTrigger,
      warningAlarm: api.warningAlarm,
      criticalAlarm: api.criticalAlarm,
      base_url: api.base_url,
      common: api.common,
      numTest: api.numTest,
      consecutiveFailedTest: api.consecutiveFailedTest,
      consecutiveSuccessfulTest: api.consecutiveSuccessfulTest,
      histFailedTest: api.histFailedTest,
      histSuccessfulTest: api.histSuccessfulTest
    };
  }
  
  private handleApiData(apiDataList:Array<GetApis>) {
    if (apiDataList.length > 0) {
      this.tableIsEmpty = false;
      this.dataSource = new MatTableDataSource<any>(apiDataList);
      this.dataSource.paginator = this.paginator;
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
    console.error('error sse apis', error);
    this.tableIsEmpty=true;
  }
}
