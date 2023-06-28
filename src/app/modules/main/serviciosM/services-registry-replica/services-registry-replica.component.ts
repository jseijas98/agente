import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import StringUtils from 'src/app/common/util/stringUtils';
import { ApiReplicasResgistry } from 'src/app/modules/interfaces/model.apis/model.apiReplicasResgistry';
import { ServicesReplicasRegistry } from 'src/app/modules/interfaces/model.services/model.registryServicesReplica';
import { GraphServiceService } from 'src/app/services/graph/graph-service.service';
import { environment } from 'src/environments/environment';
import { MetadataComponent } from '../../../../components/modals/metadata/metadata.component';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';

@Component({
  selector: 'app-services-registry-replica',
  templateUrl: './services-registry-replica.component.html',
  styleUrls: ['./services-registry-replica.component.css'],
})
export class ServicesRegistryReplicaComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    private sseServiceService: SseServiceService,
    private dynamicFilterService:DynamicFilterService

  ) {}

  ngOnDestroy() {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
    console.log('se cerro el sse');
    this.sseServiceService.closeEventSource();
  }
  ngAfterViewInit(): void {
    // this.activateRouter.params.subscribe((params) => {
    //   this.Service_Replicas_Resgistry(params['id'], params['ip']);
    // });
    this.sseServiceRegirtyReplica();
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

  displayedColumns: string[] = [
    'serviceId',
    'replicaIp',
    'metadata',
    'status',
    'creation_date',
    'replica_name',
    'lastTestDate',
    'label_hash',
  ];
  //TODO: LISTO con sse

  metadataModal: string = 'ver la metadata';
  registro: string = 'registros';
  nombre_de_replica: string;
  data: any[] = [];
  baseUrl = environment.baseUrl;
  dataSource = new MatTableDataSource<any>(this.data);
  //pointer grph info
  protected legend1: string = 'tiempo de respuesta';
  protected legend2: string = 'ms';
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataGraph: Object[] = [];
  unsuscribe$ = new Subject<void>();
  tableIsEmpty=true;
 

  Service_Replicas_Resgistry(id: any, ip: any) {
    this.http
      .get<ApiReplicasResgistry>(
        `${this.baseUrl}registry/service/${id}/replica/${ip}`
      )
      .subscribe({
        next: this.getReplicasServiceRegistrySuccess.bind(this),
        error: this.getReplicasServiceResgistryError.bind(this),
      });
  }

  getReplicasServiceRegistrySuccess(respose: any) {
    let ServicesReplicaesgistrylist: Array<ServicesReplicasRegistry> = respose;

    console.log('response', respose);

    ServicesReplicaesgistrylist.forEach((ServiceReplicasResgistry) => {
      this.data.push({
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

      console.log(this.data);
      this.nombre_de_replica = ServiceReplicasResgistry.replica_name;
      console.log(this.nombre_de_replica);
      // this.dataGraph = this.serv.dataGraph(respose, this.nombre_de_replica);
    });
    console.log('data service', this.data);
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  getReplicasServiceResgistryError(error: any) {
    console.error(error);
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
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
  sseServiceRegirtyReplica() {
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['id'], params['ip']);
      console.log(params);
      
    });
  }

  sseFuntion(id: any, ip: any) {
    console.log(id,ip);
    const httpApiLIst = `${this.baseUrl}registry/service/${id}/replica/${ip}`;
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
    response.forEach((ServiceReplicasResgistry: ServicesReplicasRegistry) => {
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
      this.nombre_de_replica = ServiceReplicasResgistry.replica_name;
    });
    console.log(datos);
    if (datos.length > 0) {
      
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
    console.log('error sse', error);
  }
}
