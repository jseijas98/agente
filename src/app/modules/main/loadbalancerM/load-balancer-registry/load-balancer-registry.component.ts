import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import StringUtils from 'src/app/common/util/stringUtils';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import { LoadBalancerRegistry } from 'src/app/modules/interfaces/model.loadBalancer/loadBalancerRegistry';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';
import { ExportExcelService } from 'src/app/services/export-excel/export-excel.service';
import { GraphServiceService } from 'src/app/services/graph/graph-service.service';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-load-balancer-registry',
  templateUrl: './load-balancer-registry.component.html',
  styleUrls: ['./load-balancer-registry.component.css'],
})
export class LoadBalancerRegistryComponent implements OnInit, AfterViewInit {
  constructor(
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    private serv: GraphServiceService,
    private sseServiceService: SseServiceService,
    private dynamicFilterService: DynamicFilterService
  ) {}

  ngAfterViewInit(): void {
    this.breadcrumbService.agregarRuta(this.router.url, 'historicos');
    this.breadcrumbs = this.breadcrumbService.obtenerBreadcrumbs();
    this.sseLoadbalancerRegistry();
  }

  ngOnInit(): void {
    this.dynamicFilterService.dynamicFilter('filterValue');
  }

  ngOnDestroy() {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
    this.sseServiceService.closeEventSource();
    console.log('se cerro el sse');
  }

  downlaod() {
    this.excel.exportToExcel(
      this.dataSource,
      this.displayedColumns,
      this.name_element
    );
  }

  displayedColumns: string[] = [
    'registry_id',
    'loadBalancerId',
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
  dataGraph: Object[] = [];
  name_element: string;
  unsuscribe$ = new Subject<void>();
  baseUrl = environment.baseUrl;
  dataSource = new MatTableDataSource<any>(this.data);
  //pointer grph info
  protected legend1: string = 'tiempo de respuesta';
  protected legend2: string = 'ms';
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  tableIsEmpty = true;
  router = inject(Router);
  breadcrumbService = inject(BreadcrumbService);
  excel = inject(ExportExcelService);
  public breadcrumbs: { label: string; url: string }[] = [];

  sseLoadbalancerRegistry() {
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['id']);
    });
  }

  sseFuntion(index: any) {
    const httpApiLIst = `${environment.baseUrl}registry/application/${index}/loadBalancer`;
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
    response.forEach((loadBalancer: LoadBalancerRegistry) => {
      datos.push({
        registry_id: loadBalancer.registryId,
        loadBalancerId: loadBalancer.vserverId,
        status: loadBalancer.status,
        applicationId: loadBalancer.applicationId,
        description: loadBalancer.description,
        consecutiveFailedTest: loadBalancer.failedConsecutiveTest,
        histFailedTest: loadBalancer.historyFailedTest,
        lastTestDate: this.utils.formatDate(loadBalancer.lastTestDate),
        response_time: loadBalancer.response_time,
        consecutiveSuccessfulTest: loadBalancer.successfulConsecutiveTest,
        histSuccessfulTest: loadBalancer.historySuccessfulTest,
      });
      this.name_element = 'load balancer de ' + loadBalancer.description;
    });
    console.log(datos);
    if (datos.length > 0) {
      this.dataGraph = this.serv.dataGraph_load_balancer(
        response,
        this.name_element
      );
      this.tableIsEmpty = false;
      this.dataSource = new MatTableDataSource<any>(datos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.currentPageIndex = this.paginator.pageIndex;
      this.applyFilter();
    } else {
      this.dataSource = new MatTableDataSource<any>([]);
      this.dataSource.data = [{ message: 'Sin datos para mostrar' }];
      this.tableIsEmpty = false;
    }
  }
  filterValue: string = '';
  currentPageIndex: number;

  applyFilter() {
    this.dataSource.filter = this.filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.pageIndex = this.currentPageIndex;
    }
    localStorage.setItem('filterValue', this.filterValue);
    console.log('valor almacenado', this.filterValue);
  }
  onFilterInputChanged(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filterValue = inputValue ? inputValue.trim().toLowerCase() : '';
    this.applyFilter();
  }

  Error(error: any) {
    console.log('error sse loadbalancer', error);
  }
}
