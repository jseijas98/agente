import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import StringUtils from 'src/app/common/util/stringUtils';
import { UpdateparamsComponent } from 'src/app/components/modals/updateparams/updateparams.component';
import { LoadBalancerList } from 'src/app/modules/interfaces/model.loadBalancer/loadBalacerList';
import { RowAlertService } from 'src/app/services/row-alert/row-alert.service';
import { NotificationsService } from 'src/app/services/notification/notifications.service';
import { environment } from 'src/environments/environment';
import { DeleteService, PayloadType } from 'src/app/services/deleteElement/delete.service';
import { AppNameService } from 'src/app/services/app-name/app-name.service';
import { Subject, takeUntil } from 'rxjs';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import { ResponseModel } from 'src/app/modules/interfaces/model.apis/model.getApis';

@Component({
  selector: 'app-load-balancer-list',
  templateUrl: './load-balancer-list.component.html',
  styleUrls: ['./load-balancer-list.component.css'],
})
export class LoadBalancerListComponent implements AfterViewInit {
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
  ) {}

  appname: string;
  registro: string = 'registros historicos';
  index = 'loadBalancer';
  unsuscribe$ = new Subject<void>();

  breadcrumbService = inject(BreadcrumbService)
  public breadcrumbs: { label: string; url: string }[] = [];


  ngOnDestroy() {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
    this.sseServiceService.closeEventSource();
    console.log('se cerro el sse');
  }

  ngAfterViewInit(): void {
    // this.activateRouter.params.subscribe((params) => {
    //   this.appName
    //     .getDataFromApi(params['id'])
    //     .pipe(takeUntil(this.unsuscribe$))
    //     .subscribe((data) => (this.appname = data));
    // });
    // this.callLoadBalancerData();
    this.activateRouter.params.subscribe((params) => {
      this.appName.getDataFromApi(params['id']).subscribe((data) => {
        this.appname = data
        this.breadcrumbService.agregarRuta('/', 'Dashboard');
        this.breadcrumbService.agregarRuta('/graph-app/' + params['id'], this.appname)
        this.breadcrumbService.agregarRuta('/loadBalancer-list/' + params['id'], 'balanceadores')
        this.breadcrumbs = this.breadcrumbService.obtenerBreadcrumbs();
      });
    });
    this.sseLoadbalancerList();
  }

  callLoadBalancerData() {
    this.activateRouter.params.subscribe((params) => {
      this.loadBalancer(params['id']);
    });
  }

  //columnsas que se muestran
  displayedColumns: string[] = [
    'applId',
    'Id',
    'description',
    'status',
    'test_interval',
    'response_time',
    'last_test',
    'warningTrigger',
    'criticalTrigger',
    'warningAlarm',
    'criticalAlarm',
    'consecutiveFailedTest',
    'consecutiveSuccessfulTest',
    'registros',
    'editar',
    'select',
  ];

  //configuración del dataSource
  dataSource = new MatTableDataSource<any>();

  //paginacion del las tablas
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  tableIsEmpty = true;

  loadBalancer(index: number) {
    this.activateRouter;
    this.http
      .get<LoadBalancerList>(
        `${environment.baseUrl}list/application/${index}/loadBalancer`
      )
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe({
        next: this.getloadBalancerSuccess.bind(this),
        error: this.getloadBalancerError.bind(this),
      });
  }

  //TODO : quitar los % en los trigger y agreagar N° de test fallidos para fallar

  getloadBalancerSuccess(respose: any) {
    let loadBalancerList: Array<LoadBalancerList> = respose;
    let data: any[] = [];
    console.log(respose);

    loadBalancerList.forEach((loadBalancer) => {
      data.push({
        Id: loadBalancer.vserverId,
        description: loadBalancer.description,
        status: loadBalancer.status,
        test_interval: loadBalancer.testInterv,
        response_time: loadBalancer.response_time,
        last_test: this.utils.formatDate(loadBalancer.lastTestDate),
        applId: loadBalancer.applicationId,
        warningTrigger: loadBalancer.warningTrigger,
        criticalTrigger: loadBalancer.criticalTrigger,
        warningAlarm: loadBalancer.warningAlarm,
        criticalAlarm: loadBalancer.criticalAlarm,
        consecutiveSuccessfulTest: loadBalancer.consecutiveSuccessfulTest,
        consecutiveFailedTest: loadBalancer.consecutiveFailedTest,
      });
    });

    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getloadBalancerError(error: any) {
    console.error(error);
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  loadBalancerRegistry(loadBalacerID: any) {
    this.router.navigateByUrl(`loadBalancer-registry/${loadBalacerID}`);
    console.log(loadBalacerID);
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
      this.callLoadBalancerData();
    });
  }

  addItem(newItem: any) {
    newItem !== undefined
      ? console.log('data', newItem)
      : console.log('closed dialog without item update!');
    this.callLoadBalancerData();
  }

  deleteData() {
    this.service.dataSource = this.dataSource;
    this.service.DeleteData(PayloadType.LOADBALANCER);
    this.sseLoadbalancerList();
  }

  sseLoadbalancerList() {
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['id']);
    });
  }

  sseFuntion(index: any) {
    const httpApiLIst = `http://180.183.170.56:30446/monitor-agent-service/v2/get/all/${index}/${this.index}`;
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
    let datos: any[] = [];
    response.data.forEach((loadBalancer: LoadBalancerList) => {
      datos.push({
        Id: loadBalancer.vserverId,
        description: loadBalancer.description,
        status: loadBalancer.status,
        test_interval: loadBalancer.testInterv,
        response_time: loadBalancer.response_time,
        last_test: this.utils.formatDate(loadBalancer.lastTestDate),
        applId: loadBalancer.applicationId,
        warningTrigger: loadBalancer.warningTrigger,
        criticalTrigger: loadBalancer.criticalTrigger,
        warningAlarm: loadBalancer.warningAlarm,
        criticalAlarm: loadBalancer.criticalAlarm,
        consecutiveSuccessfulTest: loadBalancer.consecutiveSuccessfulTest,
        consecutiveFailedTest: loadBalancer.consecutiveFailedTest,
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
    } else {
      this.dataSource = new MatTableDataSource<any>([]);
      this.dataSource.data = [{ message: 'Sin datos para mostrar' }];
      this.tableIsEmpty = false;
    }
  }
  currentPageIndex: number;

  Error(error: any) {
    console.log('error sse loadbalancer', error);
  }

  filterValue: string = '';

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

  ngOnInit(): void {
    this.dynamicFilterService.dynamicFilter('filterValue');
  }
}
