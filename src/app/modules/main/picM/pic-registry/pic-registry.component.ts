import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import StringUtils from 'src/app/common/util/stringUtils';
import { PicRegistry } from 'src/app/modules/interfaces/model.pic/model.pic-registry';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';
import { GraphServiceService } from 'src/app/services/graph/graph-service.service';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pic-registry',
  templateUrl: './pic-registry.component.html',
  styleUrls: ['./pic-registry.component.css'],
})
export class PicRegistryComponent implements OnInit, AfterViewInit {
  constructor(
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    private serv: GraphServiceService,
    private sseServiceService: SseServiceService,
    private dynamicFilterService: DynamicFilterService
  ) {}

  ngAfterViewInit(): void {
    // this.activateRouter.params.subscribe((params) => {
    // //   this.PIC_registry(params['id']);
    // // });

    this.ssePicRegistry();
  }

  ngOnDestroy() {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
  }

  //pointer grph info
  protected legend1: string = 'tiempo de respuesta';
  protected legend2: string = 'ms';
  unsuscribe$ = new Subject<void>();
  integration_name: string;
  dataGraph: Object[] = [];
  tableIsEmpty = true;

  filterValue: string = '';

  applyFilter() {
    this.dataSource.filter = this.filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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

  displayedColumns: string[] = [
    'registry_id',
    'PicId',
    'status',
    'applicationId',
    'description',
    'consecutiveFailedTest',
    'histFailedTest',
    'lastTestDate',
    'response_time',
    'consecutiveSuccessfulTest',
    'histSuccessfulTest',
  ];

  data: any[] = [];
  dataSource = new MatTableDataSource<any>(this.data);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  PIC_registry(index: number) {
    this.http
      .get<PicRegistry>(
        `${environment.baseUrl}registry/application/${index}/integration`
      )
      .subscribe({
        next: this.getRegistryPicSuccess.bind(this),
        error: this.getPicResgistryError.bind(this),
      });
  }

  getRegistryPicSuccess(respose: any) {
    let PicRegistry: Array<PicRegistry> = respose;
    console.log('response', respose);
    PicRegistry.forEach((PicRegistry) => {
      this.data.push({
        registry_id: PicRegistry.registry_id,
        PicId: PicRegistry.integrationId,
        status: PicRegistry.status,
        applicationId: PicRegistry.applicationId,
        description: PicRegistry.description,
        consecutiveFailedTest: PicRegistry.consecutiveFailedTest,
        histFailedTest: PicRegistry.histFailedTest,
        lastTestDate: this.utils.formatearFecha(PicRegistry.lastTestDate),
        response_time: PicRegistry.response_time,
        consecutiveSuccessfulTest: PicRegistry.consecutiveSuccessfulTest,
        histSuccessfulTest: PicRegistry.histSuccessfulTest,
      });

      this.integration_name = PicRegistry.description;
    });
    console.log('data pic', this.data);

    this.dataGraph = this.serv.dataGraph_load_balancer(
      respose,
      this.integration_name
    );
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getPicResgistryError(error: any) {
    console.error(error);
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  ssePicRegistry() {
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['id']);
    });
  }

  sseFuntion(index: any) {
    const httpApiLIst = `${environment.baseUrl}registry/application/${index}/integration`;
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
    response.forEach((PicRegistry: PicRegistry) => {
      datos.push({
        registry_id: PicRegistry.registry_id,
        PicId: PicRegistry.integrationId,
        status: PicRegistry.status,
        applicationId: PicRegistry.applicationId,
        description: PicRegistry.description,
        consecutiveFailedTest: PicRegistry.consecutiveFailedTest,
        histFailedTest: PicRegistry.histFailedTest,
        lastTestDate: this.utils.formatearFecha(PicRegistry.lastTestDate),
        response_time: PicRegistry.response_time,
        consecutiveSuccessfulTest: PicRegistry.consecutiveSuccessfulTest,
        histSuccessfulTest: PicRegistry.histSuccessfulTest,
      });
      this.integration_name = PicRegistry.description;
    });
    console.log(datos);
    if (datos.length > 0) {
      this.tableIsEmpty = false;
      this.dataSource = new MatTableDataSource<any>(datos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.applyFilter();
    } else {
      this.dataSource = new MatTableDataSource<any>([]);
      this.dataSource.data = [{ message: 'Sin datos para mostrar' }];
      this.tableIsEmpty = false;
    }
  }

  Error(error: any) {
    console.log('error sse loadbalancer', error);
  }
}
