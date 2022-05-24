import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorsListComponent } from './sectors-list.component';

describe('SectorsListComponent', () => {
  let component: SectorsListComponent;
  let fixture: ComponentFixture<SectorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectorsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
