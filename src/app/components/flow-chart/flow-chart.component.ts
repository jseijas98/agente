import { FlowChartService } from 'src/app/services/flow-chart/flow-chart.service';
import { stepRound } from 'src/app/services/flow-chart/stepRound';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GraphComponent } from '@swimlane/ngx-graph';


@Component({
  selector: 'app-flow-chart',
  templateUrl: './flow-chart.component.html',
  styleUrls: ['./flow-chart.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowChartComponent implements OnInit {
  showRender: boolean = false;
  dataNode: Array<any> = [];
  dataLink: Array<any> = [];

  @ViewChild(FlowChartComponent) chartcontainer:GraphComponent;

  // Update function

  ngOnDestroy() {
  }

  constructor(public serv: FlowChartService, private cd: ChangeDetectorRef, private elRef: ElementRef,) {}

  curve = stepRound;


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.datanode();
  }

  public layoutSettings = {
    orientation: 'LR', // Left to Right
  };

  datanode(){
    this.serv.data$.subscribe((data) => {
      if (data) this.dataNode = [...this.dataNode, ...data.nodes];
      this.dataLink = [...this.dataLink, ...data.links];
    });

  }

}
