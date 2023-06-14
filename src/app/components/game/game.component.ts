import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription, tap } from 'rxjs';
import { DEFAULT_REACTION_TIME, GameService } from 'src/app/services/game.service';
import { CELL_STATUS, CellData } from 'src/app/types/cell';
import { GameOptions } from 'src/app/types/game-options';
import { DialogResultComponent } from '../dialog-result/dialog-result.component';

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
  private dialogSubscription?: Subscription;
  private dialogRef?: MatDialogRef<DialogResultComponent>;

  constructor(public gameService: GameService, private dialog: MatDialog) {
    this.gameMap = gameService.gameMap;
  }

  ngOnInit(): void {
    this.timeInputSubscription = this.gameService.reactionTime$.subscribe(this.onReactionTimeSet.bind(this));
    this.gameEndSubscription = this.gameService.isFinish$.pipe(
      tap(() => {
        this.dialogRef = this.dialog.open(DialogResultComponent, {
          data: { score: this.gameService.gameScore },
        });
      }),
      tap(() => {
        if (this.dialogSubscription) { this.dialogSubscription.unsubscribe(); }
        this.dialogSubscription = this.dialogRef?.afterClosed().subscribe((isNewGame: boolean) => {
          if (isNewGame) {
            this.startNewGame();
          }
        });
      })
    ).subscribe();
  }

  startNewGame(): void {
    const options: GameOptions = {
      reactionTime: this.reactionTime ? this.reactionTime : DEFAULT_REACTION_TIME
    }
    this.gameService.newGame(options);
  }

  private onReactionTimeSet(time: number): void {
    this.isGameReady = time ? true : false;
    this.reactionTime = time;
  }

  ngOnDestroy(): void {
    this.timeInputSubscription?.unsubscribe();
    this.gameEndSubscription?.unsubscribe();
    this.dialogSubscription?.unsubscribe();
  }
}
