import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadBalancerRegistryComponent } from './load-balancer-registry.component';

describe('LoadBalancerRegistryComponent', () => {
  let component: LoadBalancerRegistryComponent;
  let fixture: ComponentFixture<LoadBalancerRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadBalancerRegistryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadBalancerRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
