import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import StringUtils from 'src/app/common/util/stringUtils';
import { UpdateparamsComponent } from 'src/app/components/modals/updateparams/updateparams.component';
import { PicList } from 'src/app/modules/interfaces/model.pic/model.pic-list';
import { AppNameService } from 'src/app/services/app-name/app-name.service';
import { DeleteService } from 'src/app/services/deleteElement/delete.service';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';
import { RowAlertService } from 'src/app/services/row-alert/row-alert.service';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pic-list',
  templateUrl: './pic-list.component.html',
  styleUrls: ['./pic-list.component.css'],
})
export class PicListComponent implements OnInit, AfterViewInit {

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
    private dynamicFilterService:DynamicFilterService

    ) {}

  baseUrl = environment.baseUrl;
  unsuscribe$ = new Subject<void>();
  appname: string;
  registro: string = 'registros historicos';
  replicas: string = 'replicas de pic ';
  index = 'integration';
  tableIsEmpty=true;

  //configuración del dataSource
  dataSource = new MatTableDataSource<any>();

  ngOnDestroy() {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
    console.log('se cerro el sse');
    this.sseServiceService.closeEventSource();
  }

  ngAfterViewInit(): void {
    this.activateRouter.params.subscribe((params) => {
      this.appName
        .getDataFromApi(params['id']).pipe(takeUntil(this.unsuscribe$))
        .subscribe((data) => (this.appname = data));
    });
    // this.callPicData();
    // this.activateRouter.params.subscribe((params) => {
    //   this.appName.nameApp(params['id']).subscribe((data) => (this.appname = data));
    // });
    this.ssePicList();
  }

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

  callPicData() {
    this.activateRouter.params.subscribe((params) => {
      this.Pic(params['id']);
    });
  }

  //columnsas que se muestran
  displayedColumns: string[] = [
    'Id',
    'applId',
    'channel',
    'test_interval',
    'description',
    'response_time',
    'last_test',
    'status',
    'consecutiveFailedTest',
    'consecutiveSuccessfulTest',
    'lowT',
    'highT',
    'registros',
    'lowAlarm',
    'highAlarm',
    'editar',
    'select',
  ];

  //paginacion del las tablas
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  Pic(index: number) {
    this.http
      .get<PicList>(`${this.baseUrl}list/application/${index}/integration`).pipe(takeUntil(this.unsuscribe$))
      .subscribe({
        next: this.getPicSuccess.bind(this),
        error: this.getPicError.bind(this),
      });
  }

  getPicSuccess(respose: any) {
    let picList: Array<PicList> = respose;
    let data: any[] = [];
    console.log(respose);


    picList.forEach((pic) => {
      data.push({
        Id: pic.integrationId,
        status: pic.status,
        channel: pic.channel,
        test_interval: pic.testInterv,
        response_time: pic.response_time,
        last_test: this.utils.formatDate(pic.lastTestDate),
        applId: pic.applicationId,
        consecutiveFailedTest: pic.consecutiveFailedTest,
        consecutiveSuccessfulTest: pic.consecutiveSuccessfulTest,
        description: pic.description,
        lowT: pic.highTrigger,
        highT: pic.lowTrigger,
        lowAlarm: pic.lowAlarm,
        highAlarm: pic.highAlarm
      });
    });

    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getPicError(error: any) {
    console.error(error);
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  PicRegistry(applId: any) {
    this.router.navigateByUrl(`pic-registry/${applId}`);
  }

  open(row: any) {
    const dialogRef = this.dialog.open(UpdateparamsComponent, {
      disableClose: true,
      data: {
        item_id: row.Id,
        type: this.index,
        appid: row.applId,
        label: row.description,
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
      this.callPicData();
    });
  }

  addItem(newItem: any) {
    newItem !== undefined
      ? console.log('data', newItem)
      : console.log('closed dialog without item update!');
    this.callPicData();
  }

  deleteData() {
    // this.service.dataSource = this.dataSource;
    // this.service.DeleteData(this.index);

    //   // this.callPicData();
    //   this.ssePicList();

  }

  ssePicList(){
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['id']);
    });
  }

  sseFuntion(index: any) {
    const httpApiLIst =`${environment.baseUrl}list/application/${index}/integration`;
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
    console.log('response',response);
    
    
    let datos: any[] = [];
    response.forEach((pic: PicList) =>
     { datos.push({
      Id: pic.integrationId,
      status: pic.status,
      channel: pic.channel,
      test_interval: pic.testInterv,
      response_time: pic.response_time,
      last_test: this.utils.formatDate(pic.lastTestDate),
      applId: pic.applicationId,
      consecutiveFailedTest: pic.consecutiveFailedTest,
      consecutiveSuccessfulTest: pic.consecutiveSuccessfulTest,
      description: pic.description,
      lowT: pic.highTrigger,
      highT: pic.lowTrigger,
      lowAlarm: pic.lowAlarm,
      highAlarm: pic.highAlarm
      })
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
    console.log('error sse loadbalancer', error);
  }

}
