import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiReplicasResgistry } from '../../../interfaces/model.apis/model.apiReplicasResgistry';
import StringUtils from '../../../../common/util/stringUtils';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Data } from '@angular/router';
import { MetadataComponent } from '../../../../components/modals/metadata/metadata.component';
import { GraphServiceService } from 'src/app/services/graph/graph-service.service';
import { Subject, takeUntil } from 'rxjs';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';

@Component({
  selector: 'app-registrys-apis-replicas',
  templateUrl: './registrys-apis-replicas.component.html',
  styleUrls: ['./registrys-apis-replicas.component.css'],
})
export class RegistrysApisReplicasComponent implements OnInit , AfterViewInit, OnDestroy {
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    private serv: GraphServiceService,
    private sseServiceService: SseServiceService,
    private dynamicFilterService:DynamicFilterService

  ) {}



  ngOnInit(): void {this.dynamicFilterService.dynamicFilter('filterValue')
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


  ngAfterViewInit(): void {
    // this.activateRouter.params.subscribe((params) => {
    //   this.Api_Replicas_Resgistry(params['id'], params['ip']);
    // });
    this.sseApisRegistryReplica();
  }
  ngOnDestroy(): void {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
    console.log('se cerro el sse');
    this.sseServiceService.closeEventSource();
  }

  displayedColumns: string[] = [
    'apiId',
    'replicaIp',
    'metadata',
    'status',
    'creation_date',
    'replica_name',
    'lastTestDate',
    'label_hash',
  ];

  metadataModal: string = 'ver la metadata';
  registro: string = 'registros';
  legend1: string = 'status';
  legend2: string = '%';
  data: any[] = [];
  dataGraph: Object[] = [];
  baseUrl = environment.baseUrl;
  dataSource = new MatTableDataSource<any>(this.data);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  nombre_de_replica: string;
  unsuscribe$ = new Subject<void>();
  //TODO: LISTO con sse
  tableIsEmpty=true;

  Api_Replicas_Resgistry(id: any, ip: any) {
    this.http
      .get<ApiReplicasResgistry>(
        `${this.baseUrl}registry/apis/${id}/replica/${ip}`
      )
      .subscribe({
        next: this.getReplicasApisRegistrySuccess.bind(this),
        error: this.getReplicasApisResgistryError.bind(this),
      });
  }

  getReplicasApisRegistrySuccess(respose: any) {
    let apisReplicaesgistrylist: Array<ApiReplicasResgistry> = respose;

    console.log('response', respose);

    apisReplicaesgistrylist.forEach((apiReplicasResgistry) => {
      this.data.push({
        replica_id: apiReplicasResgistry.replica_id,
        apiId: apiReplicasResgistry.apiId,
        replicaIp: apiReplicasResgistry.replicaIp,
        metadata: apiReplicasResgistry.metadata,
        status: apiReplicasResgistry.status,
        creation_date: this.utils.formatDate(apiReplicasResgistry.creation_date) ,
        replica_name: apiReplicasResgistry.replica_name,
        lastTestDate: this.utils.formatearFecha(apiReplicasResgistry.lastTestDate),
        label_hash: apiReplicasResgistry.label_hash,
      });
      this.nombre_de_replica = apiReplicasResgistry.replica_name;
      console.log(this.nombre_de_replica);
    });

    console.log('data', this.data);
    // this.dataGraph = this.serv.dataGraph(respose, this.nombre_de_replica); activar cuando los paramtros sean medibles
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  getReplicasApisResgistryError(error: any) {
    console.error(error);
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  openDialog(replica: any) {
    console.log(replica);

    const dialogRef = this.dialog.open(MetadataComponent, {
      data: replica.metadata,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  sseApisRegistryReplica() {
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['id'], params['ip']);
    });
  }

  sseFuntion(id: any, ip:any) {
    const http = `${this.baseUrl}registry/apis/${id}/replica/${ip}`;
    this.sseServiceService
      .getDataFromServer(http)
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe({
        next: this.Success.bind(this),
        error: this.Error.bind(this),
        complete: () => console.log('completed'),
      });
  }

  Success(response: any) {
    let datos: any[] = [];
    response.forEach((apiReplicasResgistry: ApiReplicasResgistry) => {
      datos.push({
        replica_id: apiReplicasResgistry.replica_id,
        apiId: apiReplicasResgistry.apiId,
        replicaIp: apiReplicasResgistry.replicaIp,
        metadata: apiReplicasResgistry.metadata,
        status: apiReplicasResgistry.status,
        creation_date: apiReplicasResgistry.creation_date,
        replica_name: apiReplicasResgistry.replica_name,
        lastTestDate: this.utils.formatearFecha(apiReplicasResgistry.lastTestDate),
        label_hash: apiReplicasResgistry.label_hash,
      });
      this.nombre_de_replica = apiReplicasResgistry.replica_name;
      console.log(this.nombre_de_replica);
      this.nombre_de_replica = apiReplicasResgistry.replica_name;
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
    console.log('error sse apis', error);
  }
}
