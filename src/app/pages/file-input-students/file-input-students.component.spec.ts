import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputStudentsComponent } from './file-input-students.component';

describe('FileInputStudentsComponent', () => {
  let component: FileInputStudentsComponent;
  let fixture: ComponentFixture<FileInputStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileInputStudentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
