import { TestBed } from '@angular/core/testing';

import { NgSelectFilteringService } from './ng-select-filtering.service';

describe('NgSelectFilteringService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgSelectFilteringService = TestBed.get(NgSelectFilteringService);
    expect(service).toBeTruthy();
  });
});
