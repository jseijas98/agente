import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import StringUtils from 'src/app/common/util/stringUtils';
import { ApiReplicasResgistry } from 'src/app/modules/interfaces/model.apis/model.apiReplicasResgistry';
import { environment } from 'src/environments/environment';
import { MetadataComponent } from '../../../../components/modals/metadata/metadata.component';

@Component({
  selector: 'app-services-registry-replica',
  templateUrl: './services-registry-replica.component.html',
  styleUrls: ['./services-registry-replica.component.css']
})
export class ServicesRegistryReplicaComponent implements OnInit {

  

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute
  ) {
    this.activateRouter.params.subscribe((params) => {
      this.Service_Replicas_Resgistry(params['ip'],params['id']);
      
    });
  }

  ngOnInit(): void {}

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

  data: any[] = [];

  baseUrl = environment.baseUrl;


  dataSource = new MatTableDataSource<any>(this.data);

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  Service_Replicas_Resgistry(id:any, ip:any) {
    this.http
      .get<ApiReplicasResgistry>(`${this.baseUrl}registry/service/${id}/replica/${ip}`)
      .subscribe({
        next: this.getReplicasServiceRegistrySuccess.bind(this),
        error: this.getReplicasServiceResgistryError.bind(this),
      });
  }
  metadataModal: string = 'ver la metadata';
  registro: string = 'registros';

  getReplicasServiceRegistrySuccess(respose: any) {
    let apisReplicaesgistrylist: Array<ApiReplicasResgistry> = respose;

    apisReplicaesgistrylist.forEach((apiReplicasResgistry) => {
      console.log(apiReplicasResgistry.metadata);

      this.data.push({
        replica_id: apiReplicasResgistry.replica_id,
        serviceId: apiReplicasResgistry.apiId,
        replicaIp: apiReplicasResgistry.replicaIp,
        metadata: apiReplicasResgistry.metadata,
        status: apiReplicasResgistry.status,
        creation_date: apiReplicasResgistry.creation_date,
        replica_name: apiReplicasResgistry.replica_name,
        lastTestDate: this.utils.convertDate(apiReplicasResgistry.lastTestDate),
        label_hash: apiReplicasResgistry.label_hash,
      });
    });
    console.log(this.data);
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  getReplicasServiceResgistryError(error: any) {
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
