import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { NotificationsService } from 'src/app/services/service/notifications.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-load-balancer-list',
  templateUrl: './load-balancer-list.component.html',
  styleUrls: ['./load-balancer-list.component.css'],
})
export class LoadBalancerListComponent implements OnInit {
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

  ngOnInit(): void { this.activateRouter.params.subscribe((params) => {
    this.loadBalancer(params['id']);
  });}

  //TODO: app load balancer list

  index = 'loadBalancer';

  //columnsas que se muestran
  displayedColumns: string[] = [
    'applId',
    'loadBalancer_id',
    'description',
    'status',
    'test_interval',
    'response_time',
    'last_test',
    'triggerLow',
    'triggerHigh',
    'lowAlarm',
    'highAlarm',
    'consecutiveFailedTest',
    'consecutiveSuccessfulTest',
    'registros'
  ];

  //configuración del dataSource
  dataSource = new MatTableDataSource<any>();

  //paginacion del las tablas
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  loadBalancer(index: number) {
    this.activateRouter;
    this.http
      .get<LoadBalancerList>(
        `${environment.baseUrl}list/application/${index}/loadBalancer`
      )
      .subscribe({
        next: this.getloadBalancerSuccess.bind(this),
        error: this.getloadBalancerError.bind(this),
      });
  }

  registro: string = 'registros historicos';

  getloadBalancerSuccess(respose: any) {
    let loadBalancerList: Array<LoadBalancerList> = respose;
    let data: any[] = [];

    loadBalancerList.forEach((loadBalancer) => {
      data.push({
        loadBalancer_id: loadBalancer.vserverId,
        description: loadBalancer.description,
        status: loadBalancer.status,
        test_interval: loadBalancer.testInterv,
        response_time: loadBalancer.response_time,
        last_test: this.utils.convertDate(loadBalancer.lastTestDate),
        applId: loadBalancer.applicationId,
        triggerLow: loadBalancer.lowTrigger,
        triggerHigh: loadBalancer.highTrigger,
        lowAlarm: loadBalancer.lowAlarm,
        highAlarm: loadBalancer.highAlarm,
        consecutiveSuccessfulTest: loadBalancer.consecutiveSuccessfulTest,
        consecutiveFailedTest: loadBalancer.consecutiveFailedTest,
      });
      
    });

    this.dataSource = new MatTableDataSource<any>(data);

    this.dataSource.paginator = this.paginator;
  }

  getloadBalancerError(error: any) {
    console.error(error);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadBalancerRegistry(applId: any) {
    this.router.navigateByUrl(`loadBalancer-registry/${applId}`);
  }

  open(row: any) {
    const dialogRef = this.dialog.open(UpdateparamsComponent, {
      disableClose: true,

      data: {
        item_id: row.loadBalancer_id,
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
      this.loadBalancer(params['id']);

      this.dataSource.paginator = this.paginator;
    });
  }
}
