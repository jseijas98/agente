import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersistenceListComponent } from './persistence-list.component';

describe('PersistenceListComponent', () => {
  let component: PersistenceListComponent;
  let fixture: ComponentFixture<PersistenceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersistenceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersistenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
