import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamPeriodSelectionComponent } from './exam-period-selection.component';

describe('ExamPeriodSelectionComponent', () => {
  let component: ExamPeriodSelectionComponent;
  let fixture: ComponentFixture<ExamPeriodSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamPeriodSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamPeriodSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
