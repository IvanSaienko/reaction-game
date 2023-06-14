import { AfterContentChecked, Component } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { GameScore } from 'src/app/types/game-score';

@Component({
  selector: 'game-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements AfterContentChecked {
  public score: GameScore;

  constructor(private gameService: GameService) {
    this.score = { pcCount: 0, userCount: 0 };
  }

  ngAfterContentChecked(): void {
    this.score = this.gameService.gameScore;
  }
}
