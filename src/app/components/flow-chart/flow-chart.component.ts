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

  // Update function

  ngOnDestroy() {
    this.elRef.nativeElement.remove();
  }

  constructor(public serv: FlowChartService, private cd: ChangeDetectorRef, private elRef: ElementRef,) {}

  curve = stepRound;

  public layoutSettings = {
    orientation: 'LR', // Left to Right
  };

  ngOnInit(): void {

    setTimeout(() => {
      this.serv.data$.subscribe((data) => {
        if (data) this.dataNode = [...this.dataNode, ...data.nodes];
        this.dataLink = [...this.dataLink, ...data.links];
      });
    }, 100);

    this.serv.update$.next(true)
    this.serv.update$.subscribe(algo => console.log(algo)
    );
  }
}
