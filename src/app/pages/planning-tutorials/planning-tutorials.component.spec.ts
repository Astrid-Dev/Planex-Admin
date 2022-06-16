import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningTutorialsComponent } from './planning-tutorials.component';

describe('PlanningTutorialsComponent', () => {
  let component: PlanningTutorialsComponent;
  let fixture: ComponentFixture<PlanningTutorialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningTutorialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningTutorialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
