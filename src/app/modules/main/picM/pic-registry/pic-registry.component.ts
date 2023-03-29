import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import StringUtils from 'src/app/common/util/stringUtils';
import { PicRegistry } from 'src/app/modules/interfaces/model.pic/model.pic-registry';
import { GraphServiceService } from 'src/app/services/graph/graph-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pic-registry',
  templateUrl: './pic-registry.component.html',
  styleUrls: ['./pic-registry.component.css'],
})
export class PicRegistryComponent implements OnInit, AfterViewInit {
  constructor(
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute,
    private serv: GraphServiceService
  ) {}

  ngAfterViewInit(): void {
    this.activateRouter.params.subscribe((params) => {
      this.PIC_registry(params['id']);
    });
  }

  ngOnInit(): void {}

  displayedColumns: string[] = [
    'registry_id',
    'PicId',
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

  baseUrl = environment.baseUrl;

  dataSource = new MatTableDataSource<any>(this.data);

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  PIC_registry(index: number) {
    this.http
      .get<PicRegistry>(
        `${this.baseUrl}registry/application/${index}/integration`
      )
      .subscribe({
        next: this.getRegistryPicSuccess.bind(this),
        error: this.getPicResgistryError.bind(this),
      });
  }

  integration_name:string

  getRegistryPicSuccess(respose: any) {
    let PicRegistry: Array<PicRegistry> = respose;
    console.log('response',respose);
    

    PicRegistry.forEach((PicRegistry) => {
      this.data.push({
        registry_id: PicRegistry.registry_id,
        PicId: PicRegistry.integrationId,
        status: PicRegistry.status,
        applicationId: PicRegistry.applicationId,
        description: PicRegistry.description,
        consecutiveFailedTest: PicRegistry.consecutiveFailedTest,
        histFailedTest: PicRegistry.histFailedTest,
        lastTestDate: this.utils.convertDate(PicRegistry.lastTestDate),
        response_time: PicRegistry.response_time,
        consecutiveSuccessfulTest: PicRegistry.consecutiveSuccessfulTest,
        histSuccessfulTest: PicRegistry.histSuccessfulTest,
      });

      this.integration_name = PicRegistry.description;
    });
    console.log(this.data);
    
    this.dataGraph = this.serv.dataGraph_load_balancer(respose, this.integration_name)
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  dataGraph: Object[] = [];

  getPicResgistryError(error: any) {
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
