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
import { ServicesList } from 'src/app/modules/interfaces/model.services/model.services-list';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css'],
})
export class ServicesListComponent implements OnInit {
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    public dialog: MatDialog,
    private snakbar: MatSnackBar
  ) {}

  public index: string = 'service';

  ngOnInit(): void {
    this.activateRouter.params.subscribe((params) => {
      this.service(params['id']);
    });
  }

  //columnsas que se muestran
  displayedColumns: string[] = [
    'applId',
    'services_id',
    'nameSpace',
    'triggerLow',
    'test_interval',
    'label_app',
    'response_time',
    'triggerHigh',
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
  @ViewChild(MatSort) sort!: MatSort;

  service(index: number) {
    this.http
      .get<ServicesList>(`${this.baseUrl}list/application/${index}/service`)
      .subscribe({
        next: this.getServicesSuccess.bind(this),
        error: this.getServicesError.bind(this),
      });
  }

  registro: string = 'registros historicos';
  replicas: string = 'replicas del servicio ';

  getServicesSuccess(response: any) {
    let serviceLIst: Array<ServicesList> = response;
    let data: any[] = [];

    serviceLIst.forEach((services) => {
      data.push({
        services_id: services.serviceId,
        status: services.status,
        nameSpace: services.nameSpace,
        test_interval: services.testInterv,
        label_app: services.labelApp,
        response_time: services.response_time,
        last_test: this.utils.convertDate(services.lastTestsDate),
        health: services.health,
        applId: services.applicationId,
        triggerLow: services.lowTrigger,
        triggerHigh: services.highTrigger,
        lowAlarm: services.lowAlarm,
        highAlarm: services.highAlarm,
      });
      console.log(data);
    });

    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  getServicesError(error: any) {
    console.error(error);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
        item_id: row.services_id,
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
      this.service(params['id']);

      this.dataSource.paginator = this.paginator;
    });
  }

  ApiRegiistry(services_id: any) {
    this.router.navigateByUrl(`services-registry/${services_id}`);
  }

  getServicesReplica(api_id: any): void {
    this.router.navigateByUrl(`services-replicas/${api_id}`);
  }
}
