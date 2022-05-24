import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSectiorTimeSelectionComponent } from './modal-sectior-time-selection.component';

describe('ModalSectiorTimeSelectionComponent', () => {
  let component: ModalSectiorTimeSelectionComponent;
  let fixture: ComponentFixture<ModalSectiorTimeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSectiorTimeSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSectiorTimeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
