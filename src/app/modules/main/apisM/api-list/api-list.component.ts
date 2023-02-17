import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GetApis } from '../../../interfaces/model.apis/model.getApis';
import StringUtils from '../../../../common/util/stringUtils';
import { environment } from 'src/environments/environment';
import { MatInput } from '@angular/material/input';
import { Parameters } from '../../../interfaces/model.parameters';
import { Observable } from 'rxjs';
import { __values } from 'tslib';
import { MatDialog } from '@angular/material/dialog';
import { UpdateParamsComponent } from 'src/app/components/modals/update-params/update-params.component';
import { NotificationsService } from 'src/app/services/service/notifications.service';

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
    protected notificationSvc: NotificationsService
  ) {}

  value:boolean | undefined;

  
  @Output() newItemEvent = new EventEmitter<boolean>();

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

  data: any[] = [];

  juan: any[] = [];

  //configuración del dataSource
  dataSource = new MatTableDataSource<any>(this.data);

  //paginacion del las tablas
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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

    apisList.forEach((api) => {
      this.data.push({
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
        highAlarm: api.highAlarm
      });
      console.log('response', this.data);
    });

    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;

  }

  algo!: boolean;




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

  updateTestInterval(interval: number, api: any, id: any) {
    let dataUpdate = {
      type: api,
      idNumber: id,
      testInterv: interval,
      lowTrigger: 0,
      highTrigger: 0,
    };

    console.log(dataUpdate);
    this.changeParameters(dataUpdate);
    console.log('data enviadia', dataUpdate);
  }

  updateTriggerLow(api: any, id: any, tLow: number) {
    let dataUpdate = {
      type: api,
      idNumber: id,
      testInterv: 0,
      lowTrigger: tLow,
      highTrigger: 0,
    };
    this.changeParameters(dataUpdate);
    console.log('data enviadia', dataUpdate);
  }

  updateTriggerHigh(api: any, id: any, tHigh: number) {
    let dataUpdate = {
      type: api,
      idNumber: id,
      testInterv: 0,
      lowTrigger: 0,
      highTrigger: tHigh,
    };
    this.changeParameters(dataUpdate);

    console.log('data enviadia', dataUpdate);
  }

  getApiReplica(api_id: any): void {
    this.router.navigateByUrl(`apis-replicas/${api_id}`);
  }

  ApiRegiistry(registry: any, applId: any) {
    this.router.navigateByUrl(`apis-registry/${applId}`);
  }

  changeParameters(dataupdate: any) {
    this.http.post<any>(this.baseUrl + 'params', dataupdate).subscribe({
      next: this.updateResponse.bind(this),
      error: this.updateError.bind(this),
    });
  }

  updateResponse(response: boolean) {
    console.log('update response:', response);
    this.openDialog(response);
  }

  updateError(error: any) {
    console.log(error);
  }

  openDialog(response: boolean) {
    console.log('opendialog response ', response);
    const dialogRef = this.dialog.open(UpdateParamsComponent, {
      data: response,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  

  sendWarning(alarm: boolean, label_app: string, triggerLow: string) {
    if (alarm === true) {
      this.notificationSvc.warning(
        'advertencia',
        `el estado de ${label_app} se encuentra por debajo de ${triggerLow}`
      );
    }
  }

  sendError(alarm: boolean, label_app: string, triggerLow: string) {
    if (alarm === true) {
      this.notificationSvc.warning(
        'ADVERTENCIA!!!',
        `el estado de ${label_app} se encuentra por debajo de ${triggerLow}`
      );
    }
  }
}
