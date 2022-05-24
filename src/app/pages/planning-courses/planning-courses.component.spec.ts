import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningCoursesComponent } from './planning-courses.component';

describe('PlanningCoursesComponent', () => {
  let component: PlanningCoursesComponent;
  let fixture: ComponentFixture<PlanningCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningCoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
