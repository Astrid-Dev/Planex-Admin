import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDepartmentEditionComponent } from './modal-department-edition.component';

describe('ModalDepartmentEditionComponent', () => {
  let component: ModalDepartmentEditionComponent;
  let fixture: ComponentFixture<ModalDepartmentEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDepartmentEditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDepartmentEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
