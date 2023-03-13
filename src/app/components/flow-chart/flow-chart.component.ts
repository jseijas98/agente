import { FlowChartService } from 'src/app/services/flow-chart/flow-chart.service';
import { stepRound } from 'src/app/services/flow-chart/stepRound';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GraphComponent} from '@swimlane/ngx-graph';


@Component({
  selector: 'app-flow-chart',
  templateUrl: './flow-chart.component.html',
  styleUrls: ['./flow-chart.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowChartComponent implements OnInit {
  dimensions: [number, number] = [0, 0];
  showRender: boolean = false;
  dataNode: Array<any> = []; 
  dataLink: Array<any> = []; 

  constructor(private serv: FlowChartService, private cd: ChangeDetectorRef) {}

  curve = stepRound;

  public layoutSettings = {
    orientation: 'LR', // Left to Right
  };

  ngOnInit(): void {

    setTimeout(() => {
      
      this.serv.data$.subscribe((data) => {
        if (data) 
        
        this.dataNode = [...this.dataNode, ...data.nodes];
        this.dataLink = [...this.dataLink, ...data.links];
      });
    }, 100);
    


  }
}
