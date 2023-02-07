import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiReplicasComponent } from './api-replicas.component';

describe('ApiReplicasComponent', () => {
  let component: ApiReplicasComponent;
  let fixture: ComponentFixture<ApiReplicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiReplicasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiReplicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
