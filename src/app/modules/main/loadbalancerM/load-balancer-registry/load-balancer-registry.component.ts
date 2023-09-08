import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import StringUtils from 'src/app/common/util/stringUtils';
import { LoadBalancerRegistry } from 'src/app/modules/interfaces/model.loadBalancer/loadBalancerRegistry';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';
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
    private dynamicFilterService:DynamicFilterService

  ) {}

  ngAfterViewInit(): void {
    this.activateRouter.params.subscribe((params) => {
      this.loadBalancer_registry(params['id']);
    });

    this.sseLoadbalancerRegistry();
  }

  ngOnInit(): void {
    this.dynamicFilterService.dynamicFilter('filterValue')
      }

  ngOnDestroy() {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
    this.sseServiceService.closeEventSource();
    console.log('se cerro el sse');
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
  tableIsEmpty=true;

  loadBalancer_registry(index: number) {
    this.http
      .get<LoadBalancerRegistry>(
        `${this.baseUrl}registry/application/${index}/loadBalancer`
      )
      .subscribe({
        next: this.getRegistryLoadBalancerSuccess.bind(this),
        error: this.getLoadBalancerResgistryError.bind(this),
      });
  }

  getRegistryLoadBalancerSuccess(respose: any) {
    let LoadBalancerRegistry: Array<LoadBalancerRegistry> = respose;

    LoadBalancerRegistry.forEach((loadBalancer) => {
      this.data.push({
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
    console.log(this.data);
    this.dataGraph = this.serv.dataGraph_load_balancer(
      respose,
      this.name_element
    );
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getLoadBalancerResgistryError(error: any) {
    console.error(error);
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

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

    }else{
      this.dataSource = new MatTableDataSource<any>([])
      this.dataSource.data = [{message:'Sin datos para mostrar'}];
      this.tableIsEmpty = false;
    }
  }
  filterValue: string = '';
  currentPageIndex: number;


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



  Error(error: any) {
    console.log('error sse loadbalancer', error);
  }
}
