import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTeacherEditionComponent } from './modal-teacher-edition.component';

describe('ModalTeacherEditionComponent', () => {
  let component: ModalTeacherEditionComponent;
  let fixture: ComponentFixture<ModalTeacherEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTeacherEditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTeacherEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
