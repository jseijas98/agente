import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrysApisReplicasComponent } from './registrys-apis-replicas.component';

describe('RegistrysApisReplicasComponent', () => {
  let component: RegistrysApisReplicasComponent;
  let fixture: ComponentFixture<RegistrysApisReplicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrysApisReplicasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrysApisReplicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
