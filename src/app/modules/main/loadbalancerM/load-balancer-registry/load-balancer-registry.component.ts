import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import StringUtils from 'src/app/common/util/stringUtils';
import { LoadBalancerRegistry } from 'src/app/modules/interfaces/model.loadBalancer/loadBalancerRegistry';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-load-balancer-registry',
  templateUrl: './load-balancer-registry.component.html',
  styleUrls: ['./load-balancer-registry.component.css']
})
export class LoadBalancerRegistryComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public utils: StringUtils,
    private activateRouter: ActivatedRoute
  ) 
  
  {
    this.activateRouter.params.subscribe((params) => {
      this.loadBalancer_registry(params['id']);
    });
  }


  ngOnInit(): void {}

  displayedColumns: string[] = [
    'registry_id',
    'loadBalancerId',
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

  loadBalancer_registry(index: number) {
    this.http
      .get<LoadBalancerRegistry>(
        `${this.baseUrl}registry/application/${index}/loadBalancer`
      )
      .subscribe({
        next: this.getRegistryLoadBalancerSuccess.bind(this),
        error: this.getLoadBalancerResgistryError.bind(this),
      });
  }

  getRegistryLoadBalancerSuccess(respose: any) {
    let LoadBalancerRegistry: Array<LoadBalancerRegistry> = respose;

    LoadBalancerRegistry.forEach((loadBalancer) => {
      this.data.push({
        registry_id: loadBalancer.registryId,
        loadBalancerId: loadBalancer.vserverId,
        status: loadBalancer.status,
        applicationId: loadBalancer.applicationId,
        description: loadBalancer.description,
        consecutiveFailedTest: loadBalancer.failedConsecutiveTest,
        histFailedTest: loadBalancer.historyFailedTest,
        lastTestDate: this.utils.convertDate(loadBalancer.lastTestDate),
        response_time: loadBalancer.response_time,
        consecutiveSuccessfulTest: loadBalancer.successfulConsecutiveTest,
        histSuccessfulTest: loadBalancer.historySuccessfulTest,
      });
    });
    console.log(this.data);
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  getLoadBalancerResgistryError(error: any) {
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
