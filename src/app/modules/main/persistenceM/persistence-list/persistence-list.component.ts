import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import StringUtils from 'src/app/common/util/stringUtils';
import { UpdateparamsComponent } from 'src/app/components/modals/updateparams/updateparams.component';
import { PersistenceList } from 'src/app/modules/interfaces/model.persistence/model.persistence-list';
import { RowAlertService } from 'src/app/services/row-alert/row-alert.service';
import { NotificationsService } from 'src/app/services/notification/notifications.service';
import { environment } from 'src/environments/environment';
import { DeleteService } from 'src/app/services/deleteElement/delete.service';
import { AppNameService } from 'src/app/services/app-name/app-name.service';
import { Subject, takeUntil } from 'rxjs';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-persistence-list',
  templateUrl: './persistence-list.component.html',
  styleUrls: ['./persistence-list.component.css'],
})
export class PersistenceListComponent implements AfterViewInit {
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

  breadcrumbService = inject(BreadcrumbService)
  public breadcrumbs: { label: string; url: string }[] = [];

  ngOnDestroy() {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
    console.log('se cerro el sse');
    this.sseServiceService.closeEventSource();
  }

  ngAfterViewInit(): void {
    // this.activateRouter.params.subscribe((params) => {
    //   this.appName
    //     .getDataFromApi(params['id'])
    //     .pipe(takeUntil(this.unsuscribe$))
    //     .subscribe((data) => (this.appname = data));
    // });
    // this.callPersistenceData()

    this.activateRouter.params.subscribe((params) => {
      this.appName.getDataFromApi(params['id']).subscribe((data) => {
        this.appname = data
        this.breadcrumbService.agregarRuta('/', 'Dashboard');
        this.breadcrumbService.agregarRuta('/graph-app/' + params['id'], this.appname)
        this.breadcrumbService.agregarRuta('/persistence-list/' + params['id'], 'bases de datos')
        this.breadcrumbs = this.breadcrumbService.obtenerBreadcrumbs();

      }
      );
    });

    this. ssePersistenceList();
  }

  callPersistenceData() {
    this.activateRouter.params.subscribe((params) => {
      this.persistence(params['id']);
    });
  }
  filterValue: string = '';

  applyFilter() {
    this.dataSource.filter = this.filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.pageIndex=this.currentPageIndex    }
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

  //columnsas que se muestran
  displayedColumns: string[] = [
    'Id',
    'applId',
    'test_interval',
    'description',
    'response_time',
    'last_test',
    'status',
    'consecutiveFailedTest',
    'consecutiveSuccessfulTest',
    'lowT',
    'highT',
    'lowAlarm',
    'highAlarm',
    'registros',
    'editar',
    'select',
  ];

  //configuración del dataSource
  dataSource = new MatTableDataSource<any>();
  //paginacion del las tablas
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  appname: string;
  unsuscribe$ = new Subject<void>();
  registro: string = 'registros historicos';
  index = 'persistence';
  tableIsEmpty=true;

  persistence(index: number) {
    this.http
      .get<PersistenceList>(
        `${environment.baseUrl}list/application/${index}/persistence`
      ).pipe(takeUntil(this.unsuscribe$))
      .subscribe({
        next: this.getPersistenceSuccess.bind(this),
        error: this.getPersistenceError.bind(this),
      });
  }

  getPersistenceSuccess(respose: any) {
    let PersistenceList: Array<PersistenceList> = respose;
    let data: any[] = [];
    PersistenceList.forEach((persistence) => {
      data.push({
        Id: persistence.dbId,
        status: persistence.status,
        test_interval: persistence.testInterv,
        response_time: persistence.response_time,
        last_test: this.utils.formatDate(persistence.lastTestDate),
        applId: persistence.applicationId,
        consecutiveFailedTest: persistence.consecutiveFailedTest,
        consecutiveSuccessfulTest: persistence.consecutiveSuccessfulTest,
        description: persistence.description,
        lowT: persistence.highTrigger,
        highT: persistence.lowTrigger,
        lowAlarm: persistence.lowAlarm,
        highAlarm: persistence.highAlarm,
      });
      console.log('data', data);
    });
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getPersistenceError(error: any) {
    console.error(error);
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  persistenceRegistry(applId: any) {
    this.router.navigateByUrl(`persistence-registry/${applId}`);
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
        tlow: row.lowT,
        thigh: row.highT,
        testinterval: row.test_interval
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
      this.callPersistenceData();
    });
  }

  addItem(newItem: any) {
    newItem !== undefined
      ? console.log('data', newItem)
      : console.log('closed dialog without item update!');
    this.callPersistenceData();
  }

  deleteData() {
    // this.service.dataSource = this.dataSource;
    // this.service.DeleteData(this.index);
    // setTimeout(() => {
    //   this.callPersistenceData();
    // }, 100);
  }

  ssePersistenceList(){
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['id']);
    });
  }

  sseFuntion(index: any) {
    const httpApiLIst =`${environment.baseUrl}list/application/${index}/persistence`;
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
    response.forEach((persistence: PersistenceList) =>
     { datos.push({
      Id: persistence.dbId,
      status: persistence.status,
      test_interval: persistence.testInterv,
      response_time: persistence.response_time,
      last_test: this.utils.formatDate(persistence.lastTestDate),
      applId: persistence.applicationId,
      consecutiveFailedTest: persistence.consecutiveFailedTest,
      consecutiveSuccessfulTest: persistence.consecutiveSuccessfulTest,
      description: persistence.description,
      lowT: persistence.highTrigger,
      highT: persistence.lowTrigger,
      lowAlarm: persistence.lowAlarm,
      highAlarm: persistence.highAlarm
      })
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
    console.log('error sse loadbalancer', error);
  }
}
