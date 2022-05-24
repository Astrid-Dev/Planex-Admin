import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputClassroomsComponent } from './file-input-classrooms.component';

describe('FileInputClassroomsComponent', () => {
  let component: FileInputClassroomsComponent;
  let fixture: ComponentFixture<FileInputClassroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileInputClassroomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputClassroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
