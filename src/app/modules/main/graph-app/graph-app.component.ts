import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timeout } from 'd3-timer';
import { BehaviorSubject } from 'rxjs';
import { FlowChartService } from 'src/app/services/flow-chart/flow-chart.service';
import { environment } from 'src/environments/environment';
import { ComponentListApis } from '../../interfaces/model.componetList/componentListApis';
import { ComponentListIntegration } from '../../interfaces/model.componetList/componentListIntegration';
import { ComponentListPersistence } from '../../interfaces/model.componetList/componentListPersistence';
import { ComponentListService } from '../../interfaces/model.componetList/componetListServices';

@Component({
  selector: 'app-graph-app',
  templateUrl: './graph-app.component.html',
  styleUrls: ['./graph-app.component.css'],
})
export class GraphAppComponent implements OnInit, OnDestroy {
  public graph: any = JSON.parse(sessionStorage.getItem('Graph')!);

  @ViewChild('zoneFlowChart') zoneFlowChart: ElementRef = new ElementRef('');

  constructor(
    private flowChartService: FlowChartService,
    private activateRouter: ActivatedRoute,
    private router: Router
  ) {}

  activeComponent: GraphAppComponent;
  //--------------------------------------------Oninit()-----------------------------------
  ngOnInit(): void {
    this.nodeHealth();
  }
  //---------------------------------------------------------------------------------------

  ngOnDestroy(): void {
 
  }

  ngAfterViewInit(): void {}

  nodeHealth() {
    this.activateRouter.params.subscribe((params) => {
      this.flowChartService.setData(params['id']);
      console.log('params', params['id']);
    });
  }

  redirect(prefix: string) {
    this.activateRouter.params.subscribe((params) => {
      this.router.navigateByUrl(`${prefix}/${params['id']}`);
    });

    console.log('prefi', prefix);
  }
}
