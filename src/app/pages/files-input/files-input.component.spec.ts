import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesInputComponent } from './files-input.component';

describe('FilesInputComponent', () => {
  let component: FilesInputComponent;
  let fixture: ComponentFixture<FilesInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
