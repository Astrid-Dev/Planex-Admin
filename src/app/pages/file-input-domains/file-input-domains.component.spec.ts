import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputDomainsComponent } from './file-input-domains.component';

describe('FileInputDomainsComponent', () => {
  let component: FileInputDomainsComponent;
  let fixture: ComponentFixture<FileInputDomainsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileInputDomainsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
