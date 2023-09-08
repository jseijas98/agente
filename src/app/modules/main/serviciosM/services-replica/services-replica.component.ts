import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import StringUtils from 'src/app/common/util/stringUtils';
import { ServicesReplica } from 'src/app/modules/interfaces/model.services/model.servicesReplica';
import { environment } from 'src/environments/environment';
import { MetadataComponent } from '../../../../components/modals/metadata/metadata.component';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-services-replica',
  templateUrl: './services-replica.component.html',
  styleUrls: ['./services-replica.component.css'],
})
export class ServicesReplicaComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    private router: Router,
    private sseServiceService: SseServiceService,
    private dynamicFilterService: DynamicFilterService
  ) { }

  breadcrumbService = inject(BreadcrumbService)
  title:String = '';

  ngOnDestroy() {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
    console.log('se cerro el sse');
    this.sseServiceService.closeEventSource();
  }

  ngAfterViewInit(): void {
    // this.activateRouter.params.subscribe((params) => {
    //   this.Services_replicas(params['id']);
    // });
    this.sseServiceReplica();
  }

  filterValue: string = '';

  applyFilter() {
    this.dataSource.filter = this.filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.pageIndex = this.currentPageIndex
    }
    localStorage.setItem('filterValue', this.filterValue);
    console.log('valor almacenado', this.filterValue);
  }
  onFilterInputChanged(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filterValue = inputValue ? inputValue.trim().toLowerCase() : '';
    this.applyFilter();
  }

  public breadcrumbs: { label: string; url: string }[] = [];

  ngOnInit(): void {
    this.breadcrumbService.agregarRuta(this.router.url, "replicas");
    this.breadcrumbs = this.breadcrumbService.obtenerBreadcrumbs();
    console.log(this.breadcrumbs);
    this.dynamicFilterService.dynamicFilter('filterValue');
  }

  displayedColumns: string[] = [
    'serviceId',
    'replicaIp',
    'metadata',
    'status',
    'creation_date',
    'replica_name',
    'lastTestDate',
    'label_hash',
    'registros',
  ];

  data: any[] = [];
  baseUrl = environment.baseUrl;
  name: string;
  dataSource = new MatTableDataSource<any>(this.data);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  unsuscribe$ = new Subject<void>();

  Services_replicas(index: number) {
    this.http
      .get<ServicesReplica>(
        `${this.baseUrl}actualState/service/${index}/replica`
      )
      .subscribe({
        next: this.getReplicasServicesSuccess.bind(this),
        error: this.getReplicasServicesError.bind(this),
      });
  }

  //TODO: LISTO con sse

  getReplicasServicesSuccess(respose: any) {
    let ServicesReplicalist: Array<ServicesReplica> = respose;
    console.log(respose);
    ServicesReplicalist.forEach((servicesReplica) => {
      console.log(servicesReplica.metadata);

      this.data.push({
        replica_id: servicesReplica.replica_id,
        serviceId: servicesReplica.serviceId,
        replicaIp: servicesReplica.replicaIp,
        metadata: servicesReplica.metadata,
        status: servicesReplica.status,
        creation_date: servicesReplica.creation_date,
        replica_name: servicesReplica.replica_name,
        lastTestDate: this.utils.formatDate(servicesReplica.lastTestDate),
        label_hash: servicesReplica.label_hash,
      });

      this.name = servicesReplica.replica_name.split('-')[0];
      this.title = servicesReplica.replica_name
      console.log('titulo',this.title);
    });
    console.log(this.data);
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  getReplicasServicesError(error: any) {
    console.error(error);
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  metadata1: string = 'ver la metadata';
  registro: string = 'registro';
  tableIsEmpty = true;

  // metadata

  openDialog(replica: any) {
    console.log(replica);

    const dialogRef = this.dialog.open(MetadataComponent, {
      data: replica.metadata,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  rowGetServiceId_serviceIP(service_id: any, api_ip: any) {
    this.router.navigateByUrl(
      `services-replicas-registry/${service_id}/${api_ip}`
    );
  }

  sseServiceReplica() {
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['id']);
    });
  }

  sseFuntion(index: any) {
    const httpApiLIst = `${this.baseUrl}actualState/service/${index}/replica`;
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
    try {
      if (response.body === "") {
        return
      }
      let datos: any[] = [];
      response.forEach((ServiceReplicasResgistry: ServicesReplica) => {
        datos.push({
          replica_id: ServiceReplicasResgistry.replica_id,
          serviceId: ServiceReplicasResgistry.serviceId,
          replicaIp: ServiceReplicasResgistry.replicaIp,
          metadata: ServiceReplicasResgistry.metadata,
          status: ServiceReplicasResgistry.status,
          creation_date: this.utils.formatDate(
            ServiceReplicasResgistry.creation_date
          ),
          replica_name: ServiceReplicasResgistry.replica_name,
          lastTestDate: this.utils.formatearFecha(
            ServiceReplicasResgistry.lastTestDate
          ),
          label_hash: ServiceReplicasResgistry.label_hash,
        });
        this.name = ServiceReplicasResgistry.replica_name.split('-')[0];
        this.title = this.name
        console.log('titulo',this.title);

      });
      console.log(datos);
      if (datos.length > 0) {
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
    catch (error) {
      this.algo();
      console.log(this.prueba);
      this.msgError = response.statusCode + " " + response.statusCodeValue
    }


  }

  algo() {
    this.prueba = !this.prueba
  }

  public prueba: boolean = true;
  msgError: String = '';

  currentPageIndex: number;

  Error(error: any) {
    console.log('error sse', error);
  }
}
