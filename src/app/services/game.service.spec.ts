import { TestBed } from '@angular/core/testing';

import { GameService } from './game.service';
import { CommonService } from './common.service';

describe('GameService', () => {
  let service: GameService;
  let commonServive: CommonService;

  const mockCommonService = jasmine.createSpyObj('mockCommonService', ['chunkArray', 'arrayRandElement']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GameService,
        { provide: CommonService, useValue: mockCommonService }
      ]
    });
    service = TestBed.inject(GameService);
    commonServive = TestBed.inject(CommonService);

    mockCommonService.chunkArray.and.returnValue([[1], [2]]);
    mockCommonService.arrayRandElement.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
