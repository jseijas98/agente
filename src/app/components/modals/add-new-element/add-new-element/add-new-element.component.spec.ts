import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewElementComponent } from './add-new-element.component';

describe('AddNewElementComponent', () => {
  let component: AddNewElementComponent;
  let fixture: ComponentFixture<AddNewElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewElementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
