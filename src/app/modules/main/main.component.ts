import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Applications } from '../interfaces/model.applications';
import { Router, RouterLinkActive } from '@angular/router';
import { AppNameService } from 'src/app/services/app-name/app-name.service';
import { FlowChartService } from 'src/app/services/flow-chart/flow-chart.service';
import { SseServiceService } from 'src/app/services/sse/sse-service.service';
import { environment } from 'src/environments/environment';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, AfterViewInit {
  constructor(
    public router: Router,
    private appName: AppNameService,
    public colors: FlowChartService,
    private sseServiceService: SseServiceService,
    private flowChartService: FlowChartService
  ) {}

  @ViewChild('RenderZone') zoneFlowChart: ElementRef = new ElementRef('')


dimensions: [number, number] = [0, 0];

  ngAfterViewInit(): void {
    const el = this.zoneFlowChart.nativeElement
    this.flowChartService.calculateDimensions(el);
  }

  ngOnDestroy() {}

  ngOnInit(): void {
    this.sseInit();
  }

  sseInit() {
    this.sseServiceService
      .getDataFromServerNoClose(environment.baseUrl + 'list/application')
      .subscribe(
        (response: Applications[]) => {
          if (response) {
            const data: Applications[] = response;
            this.appslist = response;
            this.appName.appSee(data);
            // this.appName.appNameSee(data);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  appslist: any[] = [];
  dataCard: Applications[] = [];

  aplicacionError(error: any) {
    console.error(error);
  }

  graph(graph_id: any) {
    this.router.navigateByUrl(`graph-app/${graph_id}`);
  }

  dashboard() {
    this.router.navigateByUrl('');
  }

  name: string | undefined;
}
