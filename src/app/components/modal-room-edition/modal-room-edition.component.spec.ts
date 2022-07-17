import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRoomEditionComponent } from './modal-room-edition.component';

describe('ModalRoomEditionComponent', () => {
  let component: ModalRoomEditionComponent;
  let fixture: ComponentFixture<ModalRoomEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRoomEditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRoomEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
