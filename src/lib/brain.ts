export function cellKey(row: number, col: number): string {
  return `${row},${col}`;
}

export class Cell {
  public value: number = 0;
  public errorValue: number = 0;
  public bgColor: string = "white";
  public textColor: string = "black";
  public disabled: boolean = false;
  public active: boolean = false;
  public isGiven: boolean = false;
  public candidates: Map<number, Candidate> = new Map();
  public readonly boxNumber: number = 0;

  getBoxNumber(row: number, col: number): number {
    return Math.floor((row - 1) / 3) * 3 + Math.floor((col - 1) / 3) + 1;
  }

  constructor(readonly row: number, readonly col: number) {
    this.boxNumber = this.getBoxNumber(row, col);
    for (let i = 1; i <= 9; i++) {
      this.candidates.set(i, new Candidate(i));
    }
  }

  public candidateCount(): number {
    return Object.values(this.candidates).filter((c) => !c.isHidden).length;
  }
}

export class Candidate {
  public bgColor: string = "white";
  public textColor: string = "black";
  public isHidden: boolean = false;
  constructor(readonly value: number) {}
}

export enum SudokuMode {
  Customize,
  Solve,
  Annotate,
}

export class Sudoku {
  public mode: SudokuMode = SudokuMode.Customize;
  public cells: Map<string, Cell> = new Map();

  constructor() {
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        const cell = new Cell(i, j);
        this.cells.set(cellKey(i, j), cell);
      }
    }
  }

  public changeMode(mode: SudokuMode) {
    this.mode = mode;
  }

  public checkCellValue(row: number, col: number, value: number) {
    for (let i = 1; i <= 9; i++) {
      if (this.cells.get(cellKey(row, i))!.value === value && i !== col) {
        this.cells.get(cellKey(row, i))!.errorValue = value;
        return false;
      }
      if (this.cells.get(cellKey(i, col))!.value === value && i !== row) {
        this.cells.get(cellKey(i, col))!.errorValue = value;
        return false;
      }
    }

    const boxNumber = this.cells.get(cellKey(row, col))!.boxNumber;
    const invalidBoxValue = this.cells.values().some((cell) => cell.boxNumber === boxNumber && cell.value === value && (cell.row !== row || cell.col !== col));
    if (invalidBoxValue) {
      this.cells.get(cellKey(row, col))!.errorValue = value;
      return false;
    }

    return true;
  }

  public setCellValue(row: number, col: number, value: number, computeCandidates: boolean = true) {
    const isValid = this.checkCellValue(row, col, value);
    if (!isValid) return;
    const cell = this.cells.get(cellKey(row, col));
    if (!cell) return;
    cell.value = value;
    if (this.mode === SudokuMode.Customize) {
      cell.isGiven = true
    }
    if (computeCandidates) this.computeCandidates();
  }

  public setActiveCell(row: number, col: number, multi = false) {
    if (!multi) {
      this.cells.forEach(cell => {
        cell.active = false;
      });
    }
    const key = cellKey(row, col);
    const cell = this.cells.get(key);
    if (cell) {
      cell.active = true;
    }
  }

  public moveActiveCell(direction: "up" | "down" | "left" | "right") {
    const activeCell = this.cells.values().find(cell => cell.active);
    if (!activeCell) return;
    let newRow = activeCell.row;
    let newCol = activeCell.col;

    switch (direction) {
      case 'up':
        newRow = Math.max(1, activeCell.row - 1);
        break;
      case 'down':
        newRow = Math.min(9, activeCell.row + 1);
        break;
      case 'left':
        newCol = Math.max(1, activeCell.col - 1);
        break;
      case 'right':
        newCol = Math.min(9, activeCell.col + 1);
        break;
    }

    this.setActiveCell(newRow, newCol);
  }

  public setValueForActiveCells(value: number) {
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        const cell = this.cells.get(cellKey(i, j));
        if (cell && cell.active) {
          this.setCellValue(i, j, value, false);
        }
      }
    }
    this.computeCandidates();
  }

  public computeCandidates() {
    this.cells.forEach(cell => {
      cell.candidates.forEach(candidate => {
        candidate.isHidden = false;
      });
    });
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        const cell = this.cells.get(cellKey(i, j));
        if (!cell) continue;
        this.cells.values().filter(c => c.row === cell.row || c.col === cell.col || c.boxNumber === cell.boxNumber).forEach(c => {
          const candidate = c.candidates.get(cell.value);
          if (!candidate) return;
          if (cell.value > 0 && (c.row !== cell.row || c.col !== cell.col)) {
            candidate.isHidden = true;
          }
        });
      }
    }
  }
}
