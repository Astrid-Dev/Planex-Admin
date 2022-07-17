import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCourseRepartitionEditionComponent } from './modal-course-repartition-edition.component';

describe('ModalCourseRepartitionEditionComponent', () => {
  let component: ModalCourseRepartitionEditionComponent;
  let fixture: ComponentFixture<ModalCourseRepartitionEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCourseRepartitionEditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCourseRepartitionEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
