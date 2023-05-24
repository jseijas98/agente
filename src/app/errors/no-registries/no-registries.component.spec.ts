import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoRegistriesComponent } from './no-registries.component';

describe('NoRegistriesComponent', () => {
  let component: NoRegistriesComponent;
  let fixture: ComponentFixture<NoRegistriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoRegistriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoRegistriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
