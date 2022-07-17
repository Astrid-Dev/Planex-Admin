import { TestBed } from '@angular/core/testing';

import { CoursesRepartitionService } from './courses-repartition.service';

describe('CoursesRepartitionService', () => {
  let service: CoursesRepartitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursesRepartitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
