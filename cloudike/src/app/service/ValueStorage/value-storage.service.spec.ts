import { TestBed } from '@angular/core/testing';

import { ValueStorageService } from './value-storage.service';

describe('ValueStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValueStorageService = TestBed.get(ValueStorageService);
    expect(service).toBeTruthy();
  });
});
