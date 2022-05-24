import { TestBed } from '@angular/core/testing';

import { FilesInputService } from './files-input.service';

describe('FilesInputService', () => {
  let service: FilesInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilesInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
