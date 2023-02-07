import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesRegistryComponent } from './services-registry.component';

describe('ServicesRegistryComponent', () => {
  let component: ServicesRegistryComponent;
  let fixture: ComponentFixture<ServicesRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesRegistryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
