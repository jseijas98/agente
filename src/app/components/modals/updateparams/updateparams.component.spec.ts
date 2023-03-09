import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateparamsComponent } from './updateparams.component';

describe('UpdateparamsComponent', () => {
  let component: UpdateparamsComponent;
  let fixture: ComponentFixture<UpdateparamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateparamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateparamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
