import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersistenceRegistryComponent } from './persistence-registry.component';

describe('PersistenceRegistryComponent', () => {
  let component: PersistenceRegistryComponent;
  let fixture: ComponentFixture<PersistenceRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersistenceRegistryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersistenceRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
