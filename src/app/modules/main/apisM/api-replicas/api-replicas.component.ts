import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiReplicas } from '../../../interfaces/model.apis/model.ApiReplicas';
import StringUtils from '../../../../common/util/stringUtils';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MetadataComponent } from '../../../../components/modals/metadata/metadata.component';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFilterService } from 'src/app/services/dynamic-Filter/dynamic-filter.service';

@Component({
  selector: 'app-api-replicas',
  templateUrl: './api-replicas.component.html',
  styleUrls: ['./api-replicas.component.css'],
})
export class ApiReplicasComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    private router: Router,
    private sseServiceService: SseServiceService,
    private dynamicFilterService:DynamicFilterService
  ) {}

  ngAfterViewInit(): void {
    // this.activateRouter.params.subscribe((params) => {
    //   this.Api_replicas(params['id']);
    // });

    this.sseApisReplia();
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
  }

  ngOnInit(): void {this.dynamicFilterService.dynamicFilter('filterValue')
}

  filterValue: string = '';

  applyFilter() {
    this.dataSource.filter = this.filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    localStorage.setItem('filterValue', this.filterValue);
    console.log('valor almacenado',this.filterValue);

  }
  onFilterInputChanged(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filterValue = inputValue ? inputValue.trim().toLowerCase() : '';
    this.applyFilter();
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
    'registros',
  ];

  //TODO: LISTO con sse
  data: any[] = [];
  unsuscribe$ = new Subject<void>();
  baseUrl = environment.baseUrl;
  dataSource = new MatTableDataSource<any>(this.data);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  metadata1: string = 'ver la metadata';
  registro: string = 'registro';
  name: string;
  tableIsEmpty=true;

  Api_replicas(index: number) {
    this.http
      .get<ApiReplicas>(`${this.baseUrl}actualState/apis/${index}/replica`)
      .subscribe({
        next: this.getReplicasApisSuccess.bind(this),
        error: this.getReplicasApisError.bind(this),
      });
  }

  getReplicasApisError(error: any) {
    console.error(error);
  }

  getReplicasApisSuccess(respose: any) {
    let apisReplicalist: Array<ApiReplicas> = respose;

    apisReplicalist.forEach((apiReplicas) => {
      console.log(apiReplicas.metadata);

      this.data.push({
        replica_id: apiReplicas.replica_id,
        apiId: apiReplicas.apiId,
        replicaIp: apiReplicas.replicaIp,
        metadata: apiReplicas.metadata,
        status: apiReplicas.status,
        creation_date:  this.utils.formatDate(apiReplicas.creation_date),
        replica_name: apiReplicas.replica_name,
        lastTestDate: this.utils.formatearFecha(apiReplicas.lastTestDate),
        label_hash: apiReplicas.label_hash,
      });
      this.name = apiReplicas.replica_name.split('-')[0];
    });
    console.log(this.data);
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
    this.applyFilter();
  }
  //******************************************************************************************************************************************************** */

  sseApisReplia() {
    this.activateRouter.params.subscribe((params) => {
      this.sseFuntion(params['id']);
    });
  }

  sseFuntion(index: any) {
    const httpApiLIst = `${this.baseUrl}actualState/apis/${index}/replica`;
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
    response.forEach((apiReplicas: ApiReplicas) => {
      datos.push({
        replica_id: apiReplicas.replica_id,
        apiId: apiReplicas.apiId,
        replicaIp: apiReplicas.replicaIp,
        metadata: apiReplicas.metadata,
        status: apiReplicas.status,
        creation_date: this.utils.formatDate(apiReplicas.creation_date) ,
        replica_name: apiReplicas.replica_name,
        lastTestDate: this.utils.formatearFecha(apiReplicas.lastTestDate),
        label_hash: apiReplicas.label_hash,
      });
      this.name = apiReplicas.replica_name.split('-')[0];
    });
    console.log(datos);
    if (datos.length > 0) {
      this.tableIsEmpty = false;
      this.dataSource = new MatTableDataSource<any>(datos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.applyFilter();

    }else{
      this.dataSource = new MatTableDataSource<any>([])
      this.dataSource.data = [{message:'Sin datos para mostrar'}];
      this.tableIsEmpty = false;
    }
  }

  Error(error: any) {
    console.log('error sse apis', error);
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

  rowGetApiId_apiIP(api_id: any, api_ip: any) {
    this.router.navigateByUrl(`apis-replicas-registry/${api_id}/${api_ip}`);

    console.log(api_id, api_ip);
  }
}
