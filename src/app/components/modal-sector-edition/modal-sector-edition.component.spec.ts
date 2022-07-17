import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSectorEditionComponent } from './modal-sector-edition.component';

describe('ModalSectorEditionComponent', () => {
  let component: ModalSectorEditionComponent;
  let fixture: ComponentFixture<ModalSectorEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSectorEditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSectorEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
