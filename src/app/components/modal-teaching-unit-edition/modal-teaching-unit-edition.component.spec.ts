import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTeachingUnitEditionComponent } from './modal-teaching-unit-edition.component';

describe('ModalTeachingUnitEditionComponent', () => {
  let component: ModalTeachingUnitEditionComponent;
  let fixture: ComponentFixture<ModalTeachingUnitEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTeachingUnitEditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTeachingUnitEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
