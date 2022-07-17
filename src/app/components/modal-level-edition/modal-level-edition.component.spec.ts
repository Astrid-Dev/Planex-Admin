import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLevelEditionComponent } from './modal-level-edition.component';

describe('ModalLevelEditionComponent', () => {
  let component: ModalLevelEditionComponent;
  let fixture: ComponentFixture<ModalLevelEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalLevelEditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLevelEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
