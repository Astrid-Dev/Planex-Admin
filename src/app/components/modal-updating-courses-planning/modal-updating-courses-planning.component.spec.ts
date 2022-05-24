import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpdatingCoursesPlanningComponent } from './modal-updating-courses-planning.component';

describe('ModalUpdatingCoursesPlanningComponent', () => {
  let component: ModalUpdatingCoursesPlanningComponent;
  let fixture: ComponentFixture<ModalUpdatingCoursesPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalUpdatingCoursesPlanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUpdatingCoursesPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
