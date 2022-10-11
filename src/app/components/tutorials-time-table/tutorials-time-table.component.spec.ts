import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialsTimeTableComponent } from './tutorials-time-table.component';

describe('TutorialsTimeTableComponent', () => {
  let component: TutorialsTimeTableComponent;
  let fixture: ComponentFixture<TutorialsTimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialsTimeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialsTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
