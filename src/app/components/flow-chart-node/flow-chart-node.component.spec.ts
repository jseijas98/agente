import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowChartNodeComponent } from './flow-chart-node.component';

describe('FlowChartNodeComponent', () => {
  let component: FlowChartNodeComponent;
  let fixture: ComponentFixture<FlowChartNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowChartNodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowChartNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
