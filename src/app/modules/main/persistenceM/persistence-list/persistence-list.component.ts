import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
import { NotificationsService } from 'src/app/services/service/notifications.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-persistence-list',
  templateUrl: './persistence-list.component.html',
  styleUrls: ['./persistence-list.component.css'],
})
export class PersistenceListComponent implements OnInit {
  baseUrl = environment.baseUrl;

  index: number = 1;

  constructor(
    private http: HttpClient,
    private router: Router,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    public dialog: MatDialog,
    protected notificationSvc: NotificationsService,
    private formBuldier: FormBuilder,
    private snakbar: MatSnackBar,
    public rowAlertService:RowAlertService
  ) {}

  ngOnInit(): void {
    this.persistence(this.index);
  }

  //columnsas que se muestran
  displayedColumns: string[] = [
    'persistence_id',
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
    'registros'
  ];

  //configuración del dataSource
  dataSource = new MatTableDataSource<any>();

  //paginacion del las tablas
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  persistence(index: number) {
    this.http
      .get<PersistenceList>(
        `${this.baseUrl}list/application/${index}/persistence`
      )
      .subscribe({
        next: this.getPersistenceSuccess.bind(this),
        error: this.getPersistenceError.bind(this),
      });
  }

  registro: string = 'registros historicos';

  getPersistenceSuccess(respose: any) {
    let PersistenceList: Array<PersistenceList> = respose;

    let data: any[] = [];

    PersistenceList.forEach((persistence) => {
      data.push({
        persistence_id: persistence.dbId,
        status: persistence.status,
        test_interval: persistence.testInterv,
        response_time: persistence.response_time,
        last_test: this.utils.convertDate(persistence.lastTestDate),
        applId: persistence.applicationId,
        consecutiveFailedTest: persistence.consecutiveFailedTest,
        consecutiveSuccessfulTest: persistence.consecutiveSuccessfulTest,
        description: persistence.description,
        lowT: persistence.highTrigger,
        highT: persistence.lowTrigger,
        lowAlarm: persistence.lowAlarm,
        highAlarm: persistence.highAlarm,
      });
      console.log('data',data);
    });

    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  getPersistenceError(error: any) {
    console.error(error);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  persistenceRegistry(applId: any) {
    this.router.navigateByUrl(`persistence-registry/${applId}`);
  }

  
  open(row: any) {
    const dialogRef = this.dialog.open(UpdateparamsComponent, {
      disableClose: true,

      data: {
        item_id: row.persistence_id,
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
      this.persistence(params['id']);

      this.dataSource.paginator = this.paginator;
    });
  }

  updateTestInterval() {}
}
