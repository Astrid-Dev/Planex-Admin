import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputLevelsComponent } from './file-input-levels.component';

describe('FileInputLevelsComponent', () => {
  let component: FileInputLevelsComponent;
  let fixture: ComponentFixture<FileInputLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileInputLevelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
