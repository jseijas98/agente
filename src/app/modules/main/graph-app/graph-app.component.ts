import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription, takeUntil } from 'rxjs';
import { AppNameService } from 'src/app/services/app-name/app-name.service';
import { FlowChartService } from 'src/app/services/flow-chart/flow-chart.service';
@Component({
  selector: 'app-graph-app',
  templateUrl: './graph-app.component.html',
  styleUrls: ['./graph-app.component.css'],
})
export class GraphAppComponent implements OnInit, OnDestroy {

  constructor(
    private flowChartService: FlowChartService,
    private activateRouter: ActivatedRoute,
    private router: Router,
    private appName: AppNameService,
    ) {}

    unsuscribe$ = new Subject<void>();

    ngOnDestroy(): void {
      this.unsuscribe$.next();
      this.unsuscribe$.complete();
    }

    public graph: string;
  isLoading = true;
  //--------------------------------------------Oninit()-----------------------------------
  ngOnInit(): void {
    this.activateRouter.params
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe((params) => {
        this.isLoading = true;
        this.appName.getDataFromApi(params['id']).subscribe((data) => {
          this.nodeHealth(params['id']);
          this.graph = data;
          this.isLoading = false;
        });
      });

  }



  //---------------------------------------------------------------------------------------

  ngAfterViewInit(): void {}

  nodeHealth(id: any) {
    this.flowChartService.setData(id);
    console.log('params', id);
  }

  redirect(prefix: string) {
    this.activateRouter.params.subscribe((params) => {
      this.router.navigateByUrl(`${prefix}/${params['id']}`);
    });

    console.log('prefi', prefix);
  }
}
