import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesTimeTableComponent } from './courses-time-table.component';

describe('CoursesTimeTableComponent', () => {
  let component: CoursesTimeTableComponent;
  let fixture: ComponentFixture<CoursesTimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursesTimeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
