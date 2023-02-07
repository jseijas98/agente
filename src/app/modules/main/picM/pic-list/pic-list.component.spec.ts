import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicListComponent } from './pic-list.component';

describe('PicListComponent', () => {
  let component: PicListComponent;
  let fixture: ComponentFixture<PicListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PicListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
