import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningExamsComponent } from './planning-exams.component';

describe('PlanningExamsComponent', () => {
  let component: PlanningExamsComponent;
  let fixture: ComponentFixture<PlanningExamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningExamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
