import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import StringUtils from 'src/app/common/util/stringUtils';
import { ServicesReplica } from 'src/app/modules/interfaces/model.services/model.servicesReplica';
import { environment } from 'src/environments/environment';
import { MetadataComponent } from '../../metadata/metadata.component';

@Component({
  selector: 'app-services-replica',
  templateUrl: './services-replica.component.html',
  styleUrls: ['./services-replica.component.css']
})
export class ServicesReplicaComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute
  ) {
    this.activateRouter.params.subscribe((params) => {
      this.Services_replicas(params['id']);
    });
  }

  ngOnInit(): void {}

  displayedColumns: string[] = [
    'servicesId',
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

  Services_replicas(index: number) {
    this.http
      .get<ServicesReplica>(`${this.baseUrl}actualState/service/${index}/replica`)
      .subscribe({
        next: this.getReplicasServicesSuccess.bind(this),
        error: this.getReplicasServicesError.bind(this),
      });
  }
  metadata1: string = 'ver la metadata';

  getReplicasServicesSuccess(respose: any) {
    let ServicesReplicalist: Array<ServicesReplica> = respose;

    ServicesReplicalist.forEach((servicesReplica) => {
      console.log(servicesReplica.metadata);

      this.data.push({
        replica_id: servicesReplica.replica_id,
        servicesId: servicesReplica.serviceId,
        replicaIp: servicesReplica.replicaIp,
        metadata: servicesReplica.metadata,
        status: servicesReplica.status,
        creation_date: servicesReplica.creation_date,
        replica_name: servicesReplica.replica_name,
        lastTestDate: this.utils.convertDate(servicesReplica.lastTestDate),
        label_hash: servicesReplica.label_hash,
      });
    });
    console.log(this.data);
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  getReplicasServicesError(error: any) {
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

