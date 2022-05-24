import { TestBed } from '@angular/core/testing';

import { CourseGroupsService } from './course-groups.service';

describe('CourseGroupsService', () => {
  let service: CourseGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
