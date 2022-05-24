import { TestBed } from '@angular/core/testing';

import { TeachingUnitsService } from './teaching-units.service';

describe('TeachingUnitsService', () => {
  let service: TeachingUnitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeachingUnitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
