import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputSupervisorsComponent } from './file-input-supervisors.component';

describe('FileInputSupervisorsComponent', () => {
  let component: FileInputSupervisorsComponent;
  let fixture: ComponentFixture<FileInputSupervisorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileInputSupervisorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileInputSupervisorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
