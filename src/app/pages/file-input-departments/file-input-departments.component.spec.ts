import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputDepartmentsComponent } from './file-input-departments.component';

describe('FileInputDepartmentsComponent', () => {
  let component: FileInputDepartmentsComponent;
  let fixture: ComponentFixture<FileInputDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileInputDepartmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
