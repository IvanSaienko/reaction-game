import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResultComponent } from './dialog-result.component';
import { GameScore } from 'src/app/types/game-score';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CELL_STATUS } from 'src/app/types/cell';

const mockData = { score: {userCount: 10, pcCount: 5} };
let mockDialogRef: MatDialogRef<DialogResultComponent>;

describe('DialogResultComponent', () => {
  let component: DialogResultComponent;
  let fixture: ComponentFixture<DialogResultComponent>;

  beforeEach(() => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [DialogResultComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    });

    fixture = TestBed.createComponent(DialogResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct header for user win', () => {
    component.score = { userCount: 10, pcCount: 2 } as GameScore;
    const header = component.getHeader();
    expect(header).toEqual('Ви перемогли!');
  });

  it('should display the correct header for pc win', () => {
    component.score = { userCount: 2, pcCount: 10 } as GameScore;
    const header = component.getHeader();
    expect(header).toEqual('Компьютер переміг!');
  });

  it('should return CELL_STATUS.USER as the winner for user win', () => {
    component.score = { userCount: 3, pcCount: 2 } as GameScore;
    const winner = component.getWinner();
    expect(winner).toEqual(CELL_STATUS.USER);
  });

  it('should return CELL_STATUS.PC as the winner for pc win', () => {
    component.score = { userCount: 2, pcCount: 3 } as GameScore;
    const winner = component.getWinner();
    expect(winner).toEqual(CELL_STATUS.PC);
  });

  it('should close the dialog when startNewGame is called', () => {
    component.startNewGame();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });
});
