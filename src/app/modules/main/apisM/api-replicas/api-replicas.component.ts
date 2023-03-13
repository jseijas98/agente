import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiReplicas } from '../../../interfaces/model.apis/model.ApiReplicas';
import StringUtils from '../../../../common/util/stringUtils';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MetadataComponent } from '../../../../components/modals/metadata/metadata.component';

@Component({
  selector: 'app-api-replicas',
  templateUrl: './api-replicas.component.html',
  styleUrls: ['./api-replicas.component.css'],
})
export class ApiReplicasComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    private router: Router
  ) {
    this.activateRouter.params.subscribe((params) => {
      this.Api_replicas(params['id']);
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
    'registros',
  ];

  data: any[] = [];

  baseUrl = environment.baseUrl;

  dataSource = new MatTableDataSource<any>(this.data);

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  Api_replicas(index: number) {
    this.http
      .get<ApiReplicas>(`${this.baseUrl}actualState/apis/${index}/replica`)
      .subscribe({
        next: this.getReplicasApisSuccess.bind(this),
        error: this.getReplicasApisError.bind(this),
      });
  }
  metadata1: string = 'ver la metadata';
  registro: string = 'registro';

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
        creation_date: apiReplicas.creation_date,
        replica_name: apiReplicas.replica_name,
        lastTestDate: this.utils.convertDate(apiReplicas.lastTestDate),
        label_hash: apiReplicas.label_hash,
      });

    
    });
    console.log(this.data);
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
  }


  getReplicasApisError(error: any) {
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

  //get api_ip and api_id

  rowGetApiId_apiIP(api_id: any, api_ip: any) {
    this.router.navigateByUrl(`apis-replicas-registry/${api_id}/${api_ip}`);

    console.log(api_id, api_ip, name);
  }
}
