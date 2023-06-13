import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DEFAULT_REACTION_TIME, GameService } from 'src/app/services/game.service';
import { CELL_STATUS } from 'src/app/types/cell';
import { BehaviorSubject, Subject, Subscription, of } from 'rxjs';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let gameServive: GameService;

  // const mockGameService = jasmine.createSpyObj('mockGameService', ['gameMap', 'reactionTime$', 'isFinish$', 'newGame']);
  const mockGameService = jasmine.createSpyObj('GameService', {
    gameMap: [[{ status: CELL_STATUS.FREE }]],
    reactionTime$: new Subject<number>(),
    isFinish$: () => of(),
    newGame: undefined
  });


  beforeEach(() => {
    // gameServiceMock = jasmine.createSpyObj('GameService', {
    //   gameMap: [[{ status: CELL_STATUS.FREE }]],
    //   reactionTime$: of(500),
    //   isFinish$: of(),
    //   newGame: undefined
    // });
    // gameServiceMock = jasmine.createSpyObj('GameService', ['gameMap', 'reactionTime$', 'isFinish$', 'newGame']);

    TestBed.configureTestingModule({
      declarations: [GameComponent],
      providers: [
        { provide: GameService, useValue: mockGameService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;

    gameServive = TestBed.inject(GameService);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call gameService.newGame with reactionTime if it is set', () => {
    const mockReactionTime = 1500;
    component['reactionTime'] = mockReactionTime;
    component.startNewGame();
    expect(mockGameService.newGame).toHaveBeenCalledWith({ reactionTime: mockReactionTime });
  });

  it('should call gameService.newGame with default reactionTime if it isn`t set', () => {
    component.startNewGame();
    expect(mockGameService.newGame).toHaveBeenCalledWith({ reactionTime: DEFAULT_REACTION_TIME });
  });

});
