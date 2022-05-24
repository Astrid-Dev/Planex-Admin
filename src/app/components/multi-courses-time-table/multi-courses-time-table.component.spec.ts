import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiCoursesTimeTableComponent } from './multi-courses-time-table.component';

describe('MultiCoursesTimeTableComponent', () => {
  let component: MultiCoursesTimeTableComponent;
  let fixture: ComponentFixture<MultiCoursesTimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiCoursesTimeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiCoursesTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
