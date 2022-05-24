import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationTimesComponent } from './configuration-times.component';

describe('ConfigurationTimesComponent', () => {
  let component: ConfigurationTimesComponent;
  let fixture: ComponentFixture<ConfigurationTimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationTimesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
