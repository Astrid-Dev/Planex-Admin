import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCourseGroupsConfigurationComponent } from './modal-course-groups-configuration.component';

describe('ModalCourseGroupsConfigurationComponent', () => {
  let component: ModalCourseGroupsConfigurationComponent;
  let fixture: ComponentFixture<ModalCourseGroupsConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCourseGroupsConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCourseGroupsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
