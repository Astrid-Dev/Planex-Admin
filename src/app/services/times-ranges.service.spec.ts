import { TestBed } from '@angular/core/testing';

import { TimesRangesService } from './times-ranges.service';

describe('TimesRangesService', () => {
  let service: TimesRangesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimesRangesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
