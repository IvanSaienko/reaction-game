import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DEFAULT_REACTION_TIME, GameService } from 'src/app/services/game.service';
import { CELL_STATUS, CellData } from 'src/app/types/cell';
import { GameOptions } from 'src/app/types/game-options';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  public CELL_STATUS = CELL_STATUS;
  public gameMap: CellData[][];
  public isGameReady = true;
  private reactionTime?: number;
  private timeInputSubscription?: Subscription;
  private gameEndSubscription?: Subscription;

  constructor(public gameService: GameService) {
    this.gameMap = gameService.gameMap;
  }

  ngOnInit(): void {
    this.timeInputSubscription = this.gameService.reactionTime$.subscribe(time => {
      this.isGameReady = time ? true : false;
      this.reactionTime = time;
    });
    this.gameEndSubscription = this.gameService.isFinish$.subscribe(() => {
      console.log('Game ended');
    });
  }

  startNewGame(): void {
    const options: GameOptions = {
      reactionTime: this.reactionTime ? this.reactionTime : DEFAULT_REACTION_TIME
    }
    this.gameService.newGame(options);
  }

  ngOnDestroy(): void {
    this.timeInputSubscription?.unsubscribe();
    this.gameEndSubscription?.unsubscribe();
  }
}
