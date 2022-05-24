import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputRoomsComponent } from './file-input-rooms.component';

describe('FileInputRoomsComponent', () => {
  let component: FileInputRoomsComponent;
  let fixture: ComponentFixture<FileInputRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileInputRoomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
