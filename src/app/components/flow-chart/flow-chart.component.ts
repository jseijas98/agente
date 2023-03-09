import { FlowChartService } from 'src/app/services/flow-chart/flow-chart.service';
import { stepRound } from 'src/app/services/flow-chart/stepRound';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GraphComponent, Layout, Graph, Edge } from '@swimlane/ngx-graph';
import * as shape from 'd3-shape';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-flow-chart',
  templateUrl: './flow-chart.component.html',
  styleUrls: ['./flow-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowChartComponent implements OnInit {
  @ViewChild('myChart')
  child: GraphComponent;
  dimensions: [number, number] = [0, 0];
  showRender: boolean = false;
  dataNode: Array<any> = []; //TODO--> tarjetas
  dataLink: Array<any> = []; //TODO: ---> lineas verdes

  constructor(
    private serv: FlowChartService,
    private cd: ChangeDetectorRef,
    private activateRouter: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  curve = stepRound;

  public layoutSettings = {
    orientation: 'LR', //TODO: Top-to-bottom  --> Left to Right
  };

  ngOnInit(): void {
    this.serv.zoneDimensions$.subscribe(([w, h]) => {
      if (w && h) {
        if (w && h) {
          this.dimensions = [w, h];
          this.showRender = true;

          console.log(this.dimensions);

          this.cd.detectChanges();

        }
      }
    });

     this.serv.data$.subscribe((data) => {
        this.dataNode = [...this.dataNode, ...data.nodes];
        this.dataLink = [...this.dataLink, ...data.links];
        console.log('data:', data);


    });


    
  }


}
