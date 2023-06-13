import { Component } from '@angular/core';
import { DEFAULT_REACTION_TIME, GameService } from 'src/app/services/game.service';

@Component({
  selector: 'game-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  public time: number = DEFAULT_REACTION_TIME;

  constructor(private gameService: GameService) {}

  timeChoosed(): void {
    this.gameService.setReactionTime(this.time);
  }
}
