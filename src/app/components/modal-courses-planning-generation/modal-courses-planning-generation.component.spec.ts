import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCoursesPlanningGenerationComponent } from './modal-courses-planning-generation.component';

describe('ModalCoursesPlanningGenerationComponent', () => {
  let component: ModalCoursesPlanningGenerationComponent;
  let fixture: ComponentFixture<ModalCoursesPlanningGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCoursesPlanningGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCoursesPlanningGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
