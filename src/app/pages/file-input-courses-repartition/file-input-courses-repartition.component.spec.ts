import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputCoursesRepartitionComponent } from './file-input-courses-repartition.component';

describe('FileInputCoursesRepartitionComponent', () => {
  let component: FileInputCoursesRepartitionComponent;
  let fixture: ComponentFixture<FileInputCoursesRepartitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileInputCoursesRepartitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputCoursesRepartitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
