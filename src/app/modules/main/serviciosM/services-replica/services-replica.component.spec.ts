import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesReplicaComponent } from './services-replica.component';

describe('ServicesReplicaComponent', () => {
  let component: ServicesReplicaComponent;
  let fixture: ComponentFixture<ServicesReplicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesReplicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesReplicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
