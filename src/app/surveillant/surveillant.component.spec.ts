import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveillantComponent } from './surveillant.component';

describe('SurveillantComponent', () => {
  let component: SurveillantComponent;
  let fixture: ComponentFixture<SurveillantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveillantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveillantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
