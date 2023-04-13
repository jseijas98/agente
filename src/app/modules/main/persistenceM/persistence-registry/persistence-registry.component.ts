import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import StringUtils from 'src/app/common/util/stringUtils';
import { PersistenceRegistry } from 'src/app/modules/interfaces/model.persistence/model.persistenceRegistry';
import { GraphServiceService } from 'src/app/services/graph/graph-service.service';
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
    private serv: GraphServiceService
  ) {}

  ngAfterViewInit(): void {
    this.activateRouter.params.subscribe((params) => {
      this.persistence_registry(params['id']);
    });
  }

  ngOnInit(): void {

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

  dataSource = new MatTableDataSource<any>(this.data);

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
        histSuccessfulTest: PersistenceRegistry.histSuccessfulTest,
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
