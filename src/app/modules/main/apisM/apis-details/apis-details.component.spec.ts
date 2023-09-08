import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApisDetailsComponent } from './apis-details.component';

describe('ApisDetailsComponent', () => {
  let component: ApisDetailsComponent;
  let fixture: ComponentFixture<ApisDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApisDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApisDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
