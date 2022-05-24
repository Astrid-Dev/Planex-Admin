import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputTeachersComponent } from './file-input-teachers.component';

describe('FileInputTeachersComponent', () => {
  let component: FileInputTeachersComponent;
  let fixture: ComponentFixture<FileInputTeachersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileInputTeachersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
