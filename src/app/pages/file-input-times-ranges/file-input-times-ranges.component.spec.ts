import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputTimesRangesComponent } from './file-input-times-ranges.component';

describe('FileInputTimesRangesComponent', () => {
  let component: FileInputTimesRangesComponent;
  let fixture: ComponentFixture<FileInputTimesRangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileInputTimesRangesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputTimesRangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
