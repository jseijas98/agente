import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
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
import { NotificationsService } from 'src/app/services/service/notifications.service';
import { ComponentList } from '../../../interfaces/model.componetList/componentList';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateparamsComponent } from 'src/app/components/modals/updateparams/updateparams.component';
import { RowAlertService } from 'src/app/services/row-alert/row-alert.service';

@Component({
  selector: 'app-api-list',
  templateUrl: './api-list.component.html',
  styleUrls: ['./api-list.component.css'],
})
export class ApiListComponent implements OnInit {
  baseUrl = environment.baseUrl;

  public index: string = 'apis';

  constructor(
    private http: HttpClient,
    private router: Router,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    public dialog: MatDialog,
    protected notificationSvc: NotificationsService,
    private snakbar: MatSnackBar,
    public rowAlertService: RowAlertService
  ) {}

  // value: boolean | undefined;

  // @Output() newItemEvent = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.activateRouter.params.subscribe((params) => {
      this.Api(params['id']);
    });
  }

  //columnsas que se muestran
  displayedColumns: string[] = [
    'applId',
    'api_id',
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
  ];

  //configuración del dataSource
  dataSource = new MatTableDataSource<any>();

  //paginacion del las tablas
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  Api(index: number) {
    this.activateRouter;
    this.http
      .get<GetApis>(`${this.baseUrl}list/application/${index}/apis`)
      .subscribe({
        next: this.getApisSuccess.bind(this),
        error: this.getApisError.bind(this),
      });
  }

  registro: string = 'registros historicos';
  replicas: string = 'replicas del api ';

  getApisSuccess(respose: any) {
    let apisList: Array<GetApis> = respose;
    let data: any[] = [];

    apisList.forEach((api) => {
      data.push({
        api_id: api.apiId,
        status: api.status,
        nameSpace: api.nameSpace,
        test_interval: api.testInterv,
        label_app: api.label_app,
        response_time: api.response_time,
        last_test: this.utils.convertDate(api.lastTestDate),
        health: api.health,
        applId: api.applicationId,
        triggerLow: api.lowTrigger,
        triggerHigh: api.highTrigger,
        lowAlarm: api.lowAlarm,
        highAlarm: api.highAlarm,
      });
      console.log('response', data);
    });

    this.dataSource = new MatTableDataSource<any>(data);

    this.dataSource.paginator = this.paginator;
  }

  getApisError(error: any) {
    console.error(error);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
        item_id: row.api_id,
        type: this.index,
        appid: row.applId,
        label: row.label_app,
        space: row.nameSpace,
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
    });

    this.activateRouter.params.subscribe((params) => {
      this.Api(params['id']);

      this.dataSource.paginator = this.paginator;
    });
  }

  // sendWarning(alarm: boolean, label_app: string, triggerLow: string) {
  //   if (alarm === true) {
  //     this.notificationSvc.warning(
  //       'advertencia',
  //       `el estado de ${label_app} se encuentra por debajo de ${triggerLow}`
  //     );
  //   }
  // }

  // sendError(alarm: boolean, label_app: string, triggerLow: string) {
  //   if (alarm === true) {
  //     this.notificationSvc.warning(
  //       'ADVERTENCIA!!!',
  //       `el estado de ${label_app} se encuentra por debajo de ${triggerLow}`
  //     );
  //   }
  // }
}
