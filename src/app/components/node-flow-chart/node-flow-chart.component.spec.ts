import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeFlowChartComponent } from './node-flow-chart.component';

describe('NodeFlowChartComponent', () => {
  let component: NodeFlowChartComponent;
  let fixture: ComponentFixture<NodeFlowChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodeFlowChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeFlowChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
