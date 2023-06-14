import { TestBed } from '@angular/core/testing';
import { DEFAULT_MAX_SCORE, DEFAULT_REACTION_TIME, GameService, MAP_SIZE } from './game.service';
import { CommonService } from './common.service';
import { CELL_STATUS, CellData } from '../types/cell';
import { of } from 'rxjs';

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

    mockCommonService.chunkArray.and.returnValue([[ {id: 1, position: {x: 0, y: 0}, status: "FREE"}], [{id: 11, position: {x: 0, y: 1}, status: "FREE"}]]);
    mockCommonService.arrayRandElement.and.returnValue({});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GameService.constructor', () => {
    it('should set default gameOptions', () => {
      expect(service['gameOptions']).toEqual({
        reactionTime: DEFAULT_REACTION_TIME,
        maxScore: DEFAULT_MAX_SCORE
      });
    });
    it('should set default gameScore', () => {
      expect(service['gameScore']).toEqual({
        userCount: 0,
        pcCount: 0,
      });
    });
    it('should call getAllCells', () => {
      expect(service['allCells'].length).toBe(100);
    });
  });

  describe('GameService.setReactionTime', () => {
    it('should set reaction time when called setReactionTime', (done) => {
      service.reactionTime$.subscribe(time => {
        expect(time).toBe(1000);
        done();
      })
      service.setReactionTime(1000);
    });
  });

  describe('GameService.newGame', () => {
    let startRoundSpy;
    let handleRoundSpy;
    let options: {reactionTime: number};
    beforeEach(() => {
      startRoundSpy = spyOn<any>(service, 'startRound').and.returnValue(of(true));
      handleRoundSpy = spyOn<any>(service, 'handleRoundActions').and.stub();
      options = { reactionTime: 2000 };
    });
    it('should unsubscribe from timer', () => {
      service['timerSubscription'] = of(true).subscribe();
      const unsubscribeSpy = spyOn<any>(service['timerSubscription'], 'unsubscribe');
      service.newGame(options);
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
    it('should call resetCells', () => {
      spyOn<any>(service, 'resetCells');
      service.newGame(options);
      expect(service['resetCells']).toHaveBeenCalled();
    });
    it('should set gameOptions', () => {
      service.newGame(options);
      expect(service['gameOptions'].reactionTime).toBe(options.reactionTime);
    });
    it('should set start game score', () => {
      service.newGame(options);
      expect(service.gameScore.userCount).toBe(0);
      expect(service.gameScore.pcCount).toBe(0);
    });
    it('should call startRound', () => {
      service.newGame(options);
      expect(service['startRound']).toHaveBeenCalled();
    });
  });

  describe('GameService.handleRoundActions', () => {
    let startRoundSpy: jasmine.Spy<jasmine.Func>;
    let options: {cell: CellData, player: CELL_STATUS}

    beforeEach(() => {
      service.highlightCell = {position: {x: 0, y: 0}, status: CELL_STATUS.FREE, id: 1};
      service.gameScore.pcCount = 5;
      service.gameScore.userCount = 9;
      service.gameMap = service['getGameMap'](service['allCells'], MAP_SIZE.cols)
      options = { cell: {position: {x: 0, y: 0}, status: CELL_STATUS.FREE, id: 1}, player: CELL_STATUS.USER };
      startRoundSpy = spyOn<any>(service, 'startRound').and.returnValue(of(true));
    });

    it('should stop executing if chosed wrong cell', () => {
      options.cell = {position: {x: 1, y: 0}, status: CELL_STATUS.FREE, id: 2};
      spyOn<any>(service, 'setScore');
      service.handleRoundActions(options.cell, options.player);
      expect(service['setScore']).toHaveBeenCalledTimes(0);
    });

    it('should stop executing if pc score is 10', () => {
      spyOn<any>(service, 'setScore');
      service.gameScore.pcCount = 10;
      service.handleRoundActions(options.cell, options.player);
      expect(service['setScore']).toHaveBeenCalledTimes(0);
    });

    it('should stop executing if player score is 10', () => {
      spyOn<any>(service, 'setScore');
      service.gameScore.userCount = 10;
      service.handleRoundActions(options.cell, options.player);
      expect(service['setScore']).toHaveBeenCalledTimes(0);
    });

    it('should unsubscribe from timer', () => {
      service['timerSubscription'] = of(true).subscribe();
      const unsubscribeSpy = spyOn<any>(service['timerSubscription'], 'unsubscribe');
      service.handleRoundActions(options.cell, options.player);
      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('should set player marker to cell status in allCells array', () => {
      service.handleRoundActions(options.cell, options.player);
      expect(service['allCells'][0].status).toBe(CELL_STATUS.USER);
    });

    it('should call setScore', () => {
      spyOn<any>(service, 'setScore').and.callThrough();
      service.handleRoundActions(options.cell, options.player);
      expect(service['setScore']).toHaveBeenCalledWith(options.player);
    });

    it('should stop executing if pc or user score after setting become 10, should to call isFinish', () => {
      spyOn<any>(service, 'isFinish');
      service.handleRoundActions(options.cell, options.player);
      expect(service['isFinish']).toHaveBeenCalled();
    });

    it('should call startRound if scores less than 10', () => {
      service.gameScore.userCount = 5;
      service.handleRoundActions(options.cell, options.player);
      expect(startRoundSpy).toHaveBeenCalled();
    });
  });

  describe('GameService.getAllCells', () => {
    it('should call getNewCellData rows * cols times', () => {
      const options = { rows: 10, cols: 10 };
      spyOn<any>(service, 'getNewCellData');
      service['getAllCells'](options.rows, options.cols);
      expect(service['getNewCellData']).toHaveBeenCalledTimes(options.rows * options.cols);
    });
    it('should return arr with length = rows * cols', () => {
      const options = { rows: 10, cols: 10 };
      const res = service['getAllCells'](options.rows, options.cols);
      expect(res.length).toBe(options.rows * options.cols);
    });
    it('should return CellData[]', () => {
      const options = { rows: 10, cols: 10 };
      const res = service['getAllCells'](options.rows, options.cols);
      expect(typeof res[0].id).toBe('number');
    });
  });
  
  describe('GameService.getFreeCells', () => {
    it('should filter allCells', () => {
      service['allCells'][0].status = CELL_STATUS.USER;
      const res = service['getFreeCells']();
      expect(res.length).toBe(99);
    });
  });
  
  describe('GameService.resetCells', () => {
    it('should set statuses FREE for each item of allCells', () => {
      service['allCells'][0].status = CELL_STATUS.USER;
      service['resetCells']();
      expect(service['allCells'][0].status).toBe(CELL_STATUS.FREE);
    });
    it('should set highlightCell to undefined', () => {
      service.highlightCell = {position: {x: 0, y: 0}, status: CELL_STATUS.FREE, id: 1};
      service['resetCells']();
      expect(service.highlightCell).toBe(undefined as unknown as CellData);
    });
  });

  describe('GameService.startRound', () => {
    let handleRoundActionsSpy: jasmine.Spy<jasmine.Func>;
    beforeEach(() => {
      handleRoundActionsSpy = spyOn(service, 'handleRoundActions').and.stub();
    });
    it('should set highlightCell to random cell', () => {
      service.highlightCell = undefined;
      service['startRound']();
      expect(service.highlightCell).not.toBe(undefined);
    });
  });

  describe('GameService.setScore', () => {
    it('should set pcCount if argument is PC', () => {
      const initianPcCount = service.gameScore.pcCount;
      service['setScore'](CELL_STATUS.PC);
      expect(service.gameScore.pcCount - initianPcCount).toBe(1);
    });
    it('should set userCount if argument is USER', () => {
      const initianUserCount = service.gameScore.userCount;
      service['setScore'](CELL_STATUS.USER);
      expect(service.gameScore.userCount - initianUserCount).toBe(1);
    });
  });
  
  describe('GameService.isFinish', () => {
    it('should emit isFinish change event and return true if user score is 10', () => {
      const isFinishSpy = spyOn(service.isFinish$, 'next');
      service.gameScore.userCount = 10;
      const res = service['isFinish']();
      expect(isFinishSpy).toHaveBeenCalled();
      expect(res).toBe(true);
    });
    it('should emit isFinish change event and return true if pc score is 10', () => {
      const isFinishSpy = spyOn(service.isFinish$, 'next');
      service.gameScore.pcCount = 10;
      const res = service['isFinish']();
      expect(isFinishSpy).toHaveBeenCalled();
      expect(res).toBe(true);
    });
    it('should return false if ucer and pc counts less than 10', () => {
      const res = service['isFinish']();
      expect(res).toBe(false);
    });
  });
});
