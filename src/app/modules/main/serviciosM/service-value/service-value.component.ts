import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import StringUtils from 'src/app/common/util/stringUtils';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import { ResponseModel } from 'src/app/modules/interfaces/model.apis/model.getApis';
import { Metric } from 'src/app/modules/interfaces/model.services/model.services-list';
import { AppNameService } from 'src/app/services/app-name/app-name.service';
import {
  DeleteService,
  PayloadType,
} from 'src/app/services/deleteElement/delete.service';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';
import { PiechartService } from 'src/app/services/piechar/piechart.service';
import { RowAlertService } from 'src/app/services/row-alert/row-alert.service';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-service-value',
  templateUrl: './service-value.component.html',
  styleUrls: ['./service-value.component.css'],
})
export class ServiceValueComponent implements OnInit, AfterViewInit {
  //variables
  appname: string;
  unsuscribe$ = new Subject<void>();
  public index: string = 'service';
  registro: string = 'registros historicos';
  replicas: string = 'replicas del servicio ';
  baseUrl = environment.baseUrl;
  tableIsEmpty = true;
  public breadcrumbs: { label: string; url: string }[] = [];
  type: string = PayloadType.SERVICEVALUE;
  data:Metric[]=[];



  //inyecciones de dependencies
  breadcrumbService = inject(BreadcrumbService);
  private activateRouter = inject(ActivatedRoute);
  private sseServiceService = inject(SseServiceService);
  private piechartService = inject(PiechartService);

  constructor() {}

  ngAfterViewInit(): void {
    this.activateRouter.params.subscribe((params) => {
      const id = params['id'];
      const app = params['app'];
      this.breadcrumbService.agregarRuta(`/service-values/${app}/${id}`,'valores');
      this.breadcrumbs = this.breadcrumbService.obtenerBreadcrumbs();
    });
    this,this.getMetricas();
  }

  ngOnInit(): void {
    this.getMetricas();
  }

  getMetricas() {
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['app'], params['id']);
    });
  }


  sseFuntion(app: any, id: any) {
    const httpApiLIst = `http://180.183.170.56:30446/monitor-agent-service/v2/get/all/${app}/${this.type}/${id}`;
    this.sseServiceService
      .getDataFromServer(httpApiLIst)
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe({
        next: this.success.bind(this),
        error: this.error.bind(this),
        complete: () => console.log('completed'),
      });
  }

  success(response: ResponseModel) {
    let data: Metric[] = response.data;
    this.piechartService.actualizarDatos(data)
    console.log('response: ',data);
    this.tableIsEmpty=false
  }
  error(error: any) {
    console.log(error);
  }
}
