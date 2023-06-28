import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import StringUtils from 'src/app/common/util/stringUtils';
import { PersistenceRegistry } from 'src/app/modules/interfaces/model.persistence/model.persistenceRegistry';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';
import { GraphServiceService } from 'src/app/services/graph/graph-service.service';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-persistence-registry',
  templateUrl: './persistence-registry.component.html',
  styleUrls: ['./persistence-registry.component.css'],
})
export class PersistenceRegistryComponent implements OnInit, AfterViewInit {
  constructor(
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    private serv: GraphServiceService,
    private sseServiceService: SseServiceService,
    private dynamicFilterService:DynamicFilterService
  ) {}

  ngAfterViewInit(): void {
    // this.activateRouter.params.subscribe((params) => {
    //   this.persistence_registry(params['id']);
    // });
     this.ssePersistenceRegistry();
  }

  filterValue: string = '';

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

  ngOnInit(): void {
this.dynamicFilterService.dynamicFilter('filterValue')
  }

  ngOnDestroy() {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
    console.log('se cerro el sse');
    this.sseServiceService.closeEventSource();
  }

  displayedColumns: string[] = [
    'registry_id',
    'persistence_id',
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
  persistence_name:string;
  baseUrl = environment.baseUrl;
   //pointer grph info
   protected legend1: string = 'tiempo de respuesta';
   protected legend2: string = 'ms';
  dataSource = new MatTableDataSource<any>(this.data);
  unsuscribe$ = new Subject<void>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  tableIsEmpty=true;

  persistence_registry(index: number) {
    this.http
      .get<PersistenceRegistry>(
        `${this.baseUrl}registry/application/${index}/persistence`
      )
      .subscribe({
        next: this.getRegistryPersistenceSuccess.bind(this),
        error: this.getPersistenceResgistryError.bind(this),
      });
  }

  getRegistryPersistenceSuccess(respose: any) {
    let PersistenceRegistry: Array<PersistenceRegistry> = respose;

    PersistenceRegistry.forEach((PersistenceRegistry) => {
      this.data.push({
        registry_id: PersistenceRegistry.registryId,
        persistence_id: PersistenceRegistry.dbId,
        status: PersistenceRegistry.status,
        applicationId: PersistenceRegistry.applicationId,
        description: PersistenceRegistry.description,
        consecutiveFailedTest: PersistenceRegistry.consecutiveFailedTest,
        histFailedTest: PersistenceRegistry.histFailedTest,
        lastTestDate: this.utils.formatearFecha(PersistenceRegistry.lastTestDate),
        response_time: PersistenceRegistry.response_time,
        consecutiveSuccessfulTest:
          PersistenceRegistry.consecutiveSuccessfulTest,
        histSuccessfulTest: PersistenceRegistry.histSuccessfulTest
      });

      this.persistence_name = PersistenceRegistry.description
    });

    this.dataGraph = this.serv.dataGraph_load_balancer(respose,this.persistence_name)
    console.log(this.data);
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getPersistenceResgistryError(error: any) {
    console.error(error);
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  ssePersistenceRegistry(){
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['id']);
    });
  }

  sseFuntion(index: any) {
    const httpApiLIst =`${environment.baseUrl}registry/application/${index}/persistence`;
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
    response.forEach((PersistenceRegistry: PersistenceRegistry) =>
     { datos.push({
      registry_id: PersistenceRegistry.registryId,
      persistence_id: PersistenceRegistry.dbId,
      status: PersistenceRegistry.status,
      applicationId: PersistenceRegistry.applicationId,
      description: PersistenceRegistry.description,
      consecutiveFailedTest: PersistenceRegistry.consecutiveFailedTest,
      histFailedTest: PersistenceRegistry.histFailedTest,
      lastTestDate: this.utils.formatearFecha(PersistenceRegistry.lastTestDate),
      response_time: PersistenceRegistry.response_time,
      consecutiveSuccessfulTest:
        PersistenceRegistry.consecutiveSuccessfulTest,
      histSuccessfulTest: PersistenceRegistry.histSuccessfulTest
      })
      this.persistence_name = PersistenceRegistry.description
    });
    console.log(datos);

    if (datos.length > 0) {
      this.dataGraph = this.serv.dataGraph_load_balancer(response,this.persistence_name)
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

  currentPageIndex: number;

  Error(error: any) {
    console.log('error sse loadbalancer', error);
  }

}
