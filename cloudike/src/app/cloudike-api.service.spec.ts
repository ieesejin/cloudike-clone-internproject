import { TestBed } from '@angular/core/testing';

import { CloudikeApiService } from './cloudike-api.service';

describe('CloudikeApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloudikeApiService = TestBed.get(CloudikeApiService);
    expect(service).toBeTruthy();
  });
});
