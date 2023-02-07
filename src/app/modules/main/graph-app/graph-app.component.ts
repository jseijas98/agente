import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FlowChartService } from 'src/app/services/flow-chart/flow-chart.service';

@Component({
  selector: 'app-graph-app',
  templateUrl: './graph-app.component.html',
  styleUrls: ['./graph-app.component.css'],
})
export class GraphAppComponent implements AfterViewInit {
  public graph: any = JSON.parse(sessionStorage.getItem('Graph')!);

  @ViewChild('zoneFlowChart') zoneFlowChart: ElementRef = new ElementRef('')

  constructor(private flowChartService: FlowChartService) {}


  ngAfterViewInit(): void {
    const el = this.zoneFlowChart.nativeElement
    console.log(el);
    this.flowChartService.calculateDimensions(el)
  }

  
}
