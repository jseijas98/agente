import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateParamsComponent } from './update-params.component';

describe('UpdateParamsComponent', () => {
  let component: UpdateParamsComponent;
  let fixture: ComponentFixture<UpdateParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateParamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
