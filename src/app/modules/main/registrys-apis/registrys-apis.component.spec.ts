import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrysApisComponent } from './registrys-apis.component';

describe('RegistrysApisComponent', () => {
  let component: RegistrysApisComponent;
  let fixture: ComponentFixture<RegistrysApisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrysApisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrysApisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
