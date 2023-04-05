import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Applications } from '../interfaces/model.applications';
import { Location } from '@angular/common';
import { Router, RouterLinkActive } from '@angular/router';
import { AppNameService } from 'src/app/services/app-name/app-name.service';
import { FlowChartService } from 'src/app/services/flow-chart/flow-chart.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor(
    public router: Router,
    private appName: AppNameService,
    public colors: FlowChartService,
    private flowChart: FlowChartService,
    private elRef: ElementRef
  ) {}




  ngOnInit(): void {
    this.flowChart.update$.subscribe((algo) => console.log(algo));

    this.appName.getApps().subscribe(
      (response) => {
        this.appslist = response;
      },
      (error) => {
        console.error(error);
      }
    );0
  }

  appslist: any[] = [];

  dataCard: Applications[] = [];

  //TODO: viewchild, data of porcents of healthcheck status pass to main component

  aplicacionError(error: any) {
    console.error(error);
  }

  graph(graph_id: any) {
    this.flowChart.update$.next(true);

    this.router.navigateByUrl(`graph-app/${graph_id}`);
  }

  dashboard(){
    this.router.navigateByUrl(``);
  }

  name: string | undefined;


}
