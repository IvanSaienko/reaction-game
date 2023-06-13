import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CELL_STATUS } from 'src/app/types/cell';
import { GameScore } from 'src/app/types/game-score';

@Component({
  selector: 'app-dialog-result',
  templateUrl: './dialog-result.component.html',
  styleUrls: ['./dialog-result.component.scss']
})
export class DialogResultComponent {
  public score: GameScore;
  public cellStatuses = CELL_STATUS;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {score: GameScore}, private dialogRef: MatDialogRef<DialogResultComponent>) {
    this.score = data.score;
  }

  public startNewGame(): void {
    this.dialogRef.close(true);
  }

  public getHeader(): string {
    return this.score.userCount > this.score.pcCount ? 'Ви перемогли!' : 'Компьютер переміг!';
  }

  public getWinner(): CELL_STATUS {
    return this.score.userCount > this.score.pcCount ? CELL_STATUS.USER : CELL_STATUS.PC;
  }
}
