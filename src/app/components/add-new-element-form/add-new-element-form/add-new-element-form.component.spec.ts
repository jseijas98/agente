import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewElementFormComponent } from './add-new-element-form.component';

describe('AddNewElementFormComponent', () => {
  let component: AddNewElementFormComponent;
  let fixture: ComponentFixture<AddNewElementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewElementFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewElementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
