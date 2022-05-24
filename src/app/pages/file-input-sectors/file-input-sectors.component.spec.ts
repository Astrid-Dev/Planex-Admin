import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputSectorsComponent } from './file-input-sectors.component';

describe('FileInputSectorsComponent', () => {
  let component: FileInputSectorsComponent;
  let fixture: ComponentFixture<FileInputSectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileInputSectorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputSectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
