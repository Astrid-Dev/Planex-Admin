import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputTeachingUnitsComponent } from './file-input-teaching-units.component';

describe('FileInputTeachingUnitsComponent', () => {
  let component: FileInputTeachingUnitsComponent;
  let fixture: ComponentFixture<FileInputTeachingUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileInputTeachingUnitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputTeachingUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
