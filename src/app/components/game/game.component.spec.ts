import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { CUSTOM_ELEMENTS_SCHEMA, InjectionToken } from '@angular/core';
import { DEFAULT_REACTION_TIME, GameService } from 'src/app/services/game.service';
import { MatDialog } from '@angular/material/dialog';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let gameService: GameService;

  const mockGameService = jasmine.createSpyObj<GameService>('GameService', ['reactionTime$', 'gameMap', 'isFinish$', 'newGame', 'gameScore']);

  const mockMatDialog = {};
  const mockInjectionToken = new InjectionToken('mat-mdc-dialog-scroll-strategy');
  const mockReactionTime = 1000;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameComponent],
      providers: [
        { provide: GameService, useValue: mockGameService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: mockInjectionToken, useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    gameService = TestBed.inject(GameService);

  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call gameService.newGame with reactionTime if it is set', () => {
    component['reactionTime'] = mockReactionTime;
    component.startNewGame();
    expect(mockGameService.newGame).toHaveBeenCalledWith({ reactionTime: mockReactionTime });
  });

  it('should call gameService.newGame with default reactionTime if it isn`t set', () => {
    component.startNewGame();
    expect(mockGameService.newGame).toHaveBeenCalledWith({ reactionTime: DEFAULT_REACTION_TIME });
  });

  it('should set reactionTime', () => {
    component['onReactionTimeSet'](mockReactionTime);
    expect(component['reactionTime']).toBe(mockReactionTime);
  });

  it('should set isGameReady if there is a time in arguments', () => {
    component['onReactionTimeSet'](mockReactionTime);
    expect(component['isGameReady']).toBe(true);
  });

  it('should set isGameReady to false if there is no time in arguments', () => {
    component['onReactionTimeSet'](undefined as unknown as number);
    expect(component['isGameReady']).toBe(false);
  });
});
