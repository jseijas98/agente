import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesRegistryReplicaComponent } from './services-registry-replica.component';

describe('ServicesRegistryReplicaComponent', () => {
  let component: ServicesRegistryReplicaComponent;
  let fixture: ComponentFixture<ServicesRegistryReplicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesRegistryReplicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesRegistryReplicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
