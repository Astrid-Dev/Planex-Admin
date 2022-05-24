import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationCoursesGroupsComponent } from './configuration-courses-groups.component';

describe('ConfigurationCoursesGroupsComponent', () => {
  let component: ConfigurationCoursesGroupsComponent;
  let fixture: ComponentFixture<ConfigurationCoursesGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationCoursesGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationCoursesGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
