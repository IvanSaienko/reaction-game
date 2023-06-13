import { Injectable } from '@angular/core';
import { GameScore } from '../types/game-score';
import { GameOptions } from '../types/game-options';
import { CELL_STATUS, CellData } from '../types/cell';
import { Subject } from 'rxjs';
import { CommonService } from './common.service';

export const DEFAULT_REACTION_TIME = 1000;
export const DEFAULT_MAX_SCORE = 10;
const MAP_SIZE = {
  cols: 10,
  rows: 10
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public gameMap: CellData[][];
  public highlightCell?: CellData;
  public gameScore: GameScore;
  public isFinish$: Subject<void> = new Subject();
  public reactionTime$: Subject<number> = new Subject<number>();
  
  private allCells: CellData[];
  private freeCells: CellData[];
  private gameOptions: GameOptions;
  private timeoutId: any;


  constructor(private commonServive: CommonService) {
    this.gameOptions = { // default value
      reactionTime: DEFAULT_REACTION_TIME,
      maxScore: DEFAULT_MAX_SCORE
    };
    this.allCells = this.getAllCells(MAP_SIZE.rows, MAP_SIZE.cols);
    this.gameMap = this.getGameMap(this.allCells, MAP_SIZE.cols);
    this.freeCells = [...this.allCells];
    this.gameScore = {
      userCount: 0,
      pcCount: 0,
    };
  }
   
  public setReactionTime(time : number): void {
    this.reactionTime$?.next(time);
  }

  public newGame(options: GameOptions): void {
    this.resetCells();
    this.gameOptions.reactionTime = options.reactionTime;
    this.gameScore = { userCount: 0, pcCount: 0 };
    this.startRound();
  }

  public handleRoundActions(cell: CellData, player: CELL_STATUS): void {
    if (cell.id !== this.highlightCell?.id || this.gameScore.pcCount >= 10 || this.gameScore.userCount >= 10) { return; }

    clearTimeout(this.timeoutId);
    this.allCells[cell.id - 1].status = player;
    this.gameMap[cell.position.y][cell.position.x].status = player;
    this.freeCells = this.getFreeCells();
    this.setScore(player);

    if (this.isFinish()) { return; }

    this.startRound();
  }

  private getAllCells(rows: number, cols: number): CellData[] {
    const allCellsArr: CellData[] = [];
    let index = 1;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        allCellsArr.push(this.getNewCellData(i, j, index));
        index++;
      }
    }
    return allCellsArr;
  }

  private getFreeCells(): CellData[] {
    return this.allCells.filter((cellData => cellData.status === CELL_STATUS.FREE));
  }

  private getGameMap(allCells: CellData[], rowLength: number): CellData[][] {
    return this.commonServive.chunkArray<CellData>(allCells, rowLength);
  }

  private getNewCellData(rowIndex: number, colIndex: number, index: number): CellData {
    return {
      position: {x: colIndex, y: rowIndex},
      status: CELL_STATUS.FREE,
      id: index
    }
  }

  private resetCells(): void {
    this.allCells = this.allCells.map(cell => {
      cell.status = CELL_STATUS.FREE;
      return cell;
    });
    this.gameMap = this.getGameMap(this.allCells, MAP_SIZE.cols);
    this.freeCells = [...this.allCells];
    this.highlightCell = undefined;
  }

  private startRound(): void {
    this.highlightCell = this.commonServive.arrayRandElement(this.freeCells);
    this.timeoutId = setTimeout(() => {
      this.handleRoundActions(this.highlightCell as CellData, CELL_STATUS.PC);
    }, this.gameOptions.reactionTime);
  }

  private setScore(player: CELL_STATUS): void {
    switch (player) {
      case CELL_STATUS.PC:
        this.gameScore.pcCount++;
        break;
      default:
        this.gameScore.userCount++;
    }
  }

  private isFinish(): boolean {
    if (this.gameScore.pcCount >= 10 || this.gameScore.userCount >= 10) {
      this.isFinish$.next();
      return true;
    }
    return false;
  }
}
