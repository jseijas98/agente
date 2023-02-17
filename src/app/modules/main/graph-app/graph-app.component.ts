import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlowChartService } from 'src/app/services/flow-chart/flow-chart.service';

@Component({
  selector: 'app-graph-app',
  templateUrl: './graph-app.component.html',
  styleUrls: ['./graph-app.component.css'],
})
export class GraphAppComponent implements OnInit {
  public graph: any = JSON.parse(sessionStorage.getItem('Graph')!);

  @ViewChild('zoneFlowChart') zoneFlowChart: ElementRef = new ElementRef('');

  constructor(
    private flowChartService: FlowChartService,
    private activateRouter: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {}

  redirect() {
    this.activateRouter.params.subscribe((params) => {
      this.router.navigateByUrl(`apis-list/${params['id']}`);
    });
  }

}
