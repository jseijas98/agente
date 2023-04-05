import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-registrys-apis-replicas',
  templateUrl: './registrys-apis-replicas.component.html',
  styleUrls: ['./registrys-apis-replicas.component.css'],
})
export class RegistrysApisReplicasComponent {
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    private serv: GraphServiceService
  ) {
    this.activateRouter.params.subscribe((params) => {
      this.Api_Replicas_Resgistry(params['id'], params['ip']);
    });
  }

  ngOnInit(): void {}

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

  data: any[] = [];
  dataGraph: Object[] = [];

  baseUrl = environment.baseUrl;

  dataSource = new MatTableDataSource<any>(this.data);

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
  metadataModal: string = 'ver la metadata';
  registro: string = 'registros';

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
        creation_date: apiReplicasResgistry.creation_date,
        replica_name: apiReplicasResgistry.replica_name,
        lastTestDate: this.utils.convertDate(apiReplicasResgistry.lastTestDate),
        label_hash: apiReplicasResgistry.label_hash,
      });
      this.nombre_de_replica = apiReplicasResgistry.replica_name;
      console.log(this.nombre_de_replica);
      this.nombre_de_replica = apiReplicasResgistry.replica_name;
    });

    console.log('data',this.data);
    this.dataGraph = this.serv.dataGraph(respose, this.nombre_de_replica);
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  nombre_de_replica: string;

  getReplicasApisResgistryError(error: any) {
    console.error(error);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

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
}
