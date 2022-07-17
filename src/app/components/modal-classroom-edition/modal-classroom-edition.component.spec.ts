import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalClassroomEditionComponent } from './modal-classroom-edition.component';

describe('ModalClassroomEditionComponent', () => {
  let component: ModalClassroomEditionComponent;
  let fixture: ComponentFixture<ModalClassroomEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalClassroomEditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalClassroomEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
