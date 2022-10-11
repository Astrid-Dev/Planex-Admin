import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiTutorialsTimeTableComponent } from './multi-tutorials-time-table.component';

describe('MultiTutorialsTimeTableComponent', () => {
  let component: MultiTutorialsTimeTableComponent;
  let fixture: ComponentFixture<MultiTutorialsTimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiTutorialsTimeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiTutorialsTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
