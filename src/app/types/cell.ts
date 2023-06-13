export interface CellData {
     position: CellCoordinates,
     status: CELL_STATUS,
     id: number
}

export interface CellCoordinates {
     x: number,
     y: number
}

export enum CELL_STATUS {
     FREE = 'FREE',
     USER = 'USER',
     PC = 'PC',
     HIGHLIGHT = 'HIGHLIGHT'
}