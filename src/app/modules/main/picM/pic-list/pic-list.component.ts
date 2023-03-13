import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import StringUtils from 'src/app/common/util/stringUtils';
import { UpdateparamsComponent } from 'src/app/components/modals/updateparams/updateparams.component';
import { PicList } from 'src/app/modules/interfaces/model.pic/model.pic-list';
import { RowAlertService } from 'src/app/services/row-alert/row-alert.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pic-list',
  templateUrl: './pic-list.component.html',
  styleUrls: ['./pic-list.component.css'],
})
export class PicListComponent implements OnInit {
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    public dialog: MatDialog,
    private snakbar: MatSnackBar,
    public rowAlertService:RowAlertService
  ) {}

  ngOnInit(): void {
    this.activateRouter.params.subscribe((params) => {
      this.Pic(params['id']);
    });
  }

  //columnsas que se muestran
  displayedColumns: string[] = [
    'pic_id',
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
  ];

  //configuración del dataSource
  dataSource = new MatTableDataSource<any>();

  //paginacion del las tablas
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  Pic(index: number) {
    this.http
      .get<PicList>(`${this.baseUrl}list/application/${index}/integration`)
      .subscribe({
        next: this.getPicSuccess.bind(this),
        error: this.getPicError.bind(this),
      });
  }

  registro: string = 'registros historicos';
  replicas: string = 'replicas de pic ';

  getPicSuccess(respose: any) {
    let picList: Array<PicList> = respose;
    let data: any[] = [];

    picList.forEach((pic) => {
      data.push({
        pic_id: pic.integrationId,
        status: pic.status,
        channel: pic.channel,
        test_interval: pic.testInterv,
        response_time: pic.response_time,
        last_test: this.utils.convertDate(pic.lastTestDate),
        applId: pic.applicationId,
        consecutiveFailedTest: pic.consecutiveFailedTest,
        consecutiveSuccessfulTest: pic.consecutiveSuccessfulTest,
        description: pic.description,
        lowT: pic.highTrigger,
        highT: pic.lowTrigger,
      });
      console.log(data);
    });

    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  getPicError(error: any) {
    console.error(error);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  PicRegistry(applId: any) {
    this.router.navigateByUrl(`pic-registry/${applId}`);
  }
  index = 'integration';

  open(row: any) {
    const dialogRef = this.dialog.open(UpdateparamsComponent, {

      disableClose: true,
      data: {
        item_id: row.pic_id,
        type: this.index,
        appid: row.applId,
        label: row.description,
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
      this.Pic(params['id']);

      this.dataSource.paginator = this.paginator;
    });
  }
}
