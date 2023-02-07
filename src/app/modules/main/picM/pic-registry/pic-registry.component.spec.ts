import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicRegistryComponent } from './pic-registry.component';

describe('PicRegistryComponent', () => {
  let component: PicRegistryComponent;
  let fixture: ComponentFixture<PicRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PicRegistryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PicRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
