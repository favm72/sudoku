import { sudokuDataset } from "./dataset"

export function cellKey(row: number, col: number): string {
  return `${row},${col}`
}

export function getBoxNumber(row: number, col: number): number {
  return Math.floor((row - 1) / 3) * 3 + Math.floor((col - 1) / 3) + 1
}

export interface SudokuSnapshot {
  values: number[]
  candidatesBinary: number[]
}

export class Cell {
  public value: number = 0
  public errorValue: number = 0
  public bgColor: string = "white"
  public highLighted: boolean = false
  public textColor: string = "black"
  public disabled: boolean = false
  public active: boolean = false
  public isGiven: boolean = false
  public candidates: Map<number, Candidate> = new Map()
  public readonly boxNumber: number = 0

  constructor(readonly row: number, readonly col: number) {
    this.boxNumber = getBoxNumber(row, col)
    for (let i = 1; i <= 9; i++) {
      this.candidates.set(i, new Candidate(i))
    }
  }
}

export class Candidate {
  public bgColor: string = "white"
  public textColor: string = "black"
  public isHidden: boolean = true
  constructor(readonly value: number) {}
}

export enum SudokuMode {
  Normal = "Normal",
  Customize = "Customize",
  Annotate = "Annotate",
}

export enum SudokuStatus {
  Waiting = "Waiting",
  Solving = "Solving",
  Paused = "Paused",
  Completed = "Completed",
  Failed = "Failed",
}

export interface SudokuData {
  id: number
  puzzle: string
  solution: string
  clues: number
  difficulty: number
  difficulty_level: string
}

export class Sudoku {
  public mode: SudokuMode = SudokuMode.Customize
  public status: SudokuStatus = SudokuStatus.Waiting
  public cells: Map<string, Cell> = new Map()
  private history: SudokuSnapshot[] = []
  private errorCount: number = 0
  private currentPuzzle: SudokuData | null = null

  constructor() {
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        const cell = new Cell(i, j)
        this.cells.set(cellKey(i, j), cell)
      }
    }
  }

  public StartSolving() {
    this.cells
      .values()
      .filter(cell => cell.value > 0)
      .forEach(cell => {
        cell.disabled = true
        cell.isGiven = true
      })
    this.mode = SudokuMode.Normal
    this.status = SudokuStatus.Solving
    this.errorCount = 0
    this.history = []
    this.saveHistory()
  }

  public checkCellValue(row: number, col: number, value: number) {
    if (this.currentPuzzle) {
      const index = (row - 1) * 9 + (col - 1)
      const solutionValue = Number(this.currentPuzzle.solution[index])
      return solutionValue === value
    } else {
      const invalid = this.cells
        .values()
        .some(
          cell =>
            (cell.col === col ||
              cell.row === row ||
              cell.boxNumber === getBoxNumber(row, col)) &&
            cell.value === value
        )
      return !invalid
    }
  }

  public toggleAnnotation() {
    if (this.mode === SudokuMode.Annotate) {
      this.mode = SudokuMode.Normal
    } else {
      this.mode = SudokuMode.Annotate
    }
    console.log(`Toggling annotation mode to: ${this.mode}`)
  }

  public setCellValue(row: number, col: number, value: number) {
    if (value > 0) {
      const isValid = this.checkCellValue(row, col, value)
      if (!isValid) {
        const cell = this.cells.get(cellKey(row, col))
        if (cell) {
          if (this.errorCount >= 3) {
            alert(
              "Has cometido demasiados errores. Por favor, reinicia el Sudoku."
            )
            this.status = SudokuStatus.Failed
          }
          cell.errorValue = value
          this.errorCount++
        }
        return
      }
    }
    const cell = this.cells.get(cellKey(row, col))
    if (!cell) return
    cell.errorValue = 0
    cell.value = value
  }

  public setActiveCell(row: number, col: number, multi = false) {
    if (!multi) {
      this.cells.forEach(cell => {
        cell.active = false
      })
    }
    const key = cellKey(row, col)
    const cell = this.cells.get(key)
    if (!cell) return

    if (cell.value > 0) {
      if (this.mode === SudokuMode.Normal) {
        this.cells.forEach(c => {
          c.highLighted = c.value === cell.value
        })
      } else if (this.mode === SudokuMode.Annotate) {
        this.cells.forEach(c => {
          c.highLighted =
            c.candidates.get(cell.value)?.isHidden === false &&
            !c.isGiven &&
            !c.value
        })
      }
    }
    cell.active = true
  }

  public loadSudoku(id: string) {
    this.status = SudokuStatus.Waiting
    const sudokuData: SudokuData | undefined = sudokuDataset.find(
      sudoku => sudoku.id === +id
    )
    if (!sudokuData) {
      alert("Sudoku no encontrado.")
      return
    }

    const values = sudokuData.puzzle.split("").map(Number)
    if (values.length !== 81) {
      alert("Formato de Sudoku inválido. Debe contener 81 valores.")
      return
    }
    for (let i = 0; i < 81; i++) {
      const row = Math.floor(i / 9) + 1
      const col = (i % 9) + 1
      this.setCellValue(row, col, values[i])
    }
    this.currentPuzzle = sudokuData
    this.StartSolving()
  }

  public newCustomSudoku() {
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        const cell = new Cell(i, j)
        this.cells.set(cellKey(i, j), cell)
      }
    }
    this.mode = SudokuMode.Customize
  }

  public moveActiveCell(direction: "up" | "down" | "left" | "right") {
    const activeCell = this.cells.values().find(cell => cell.active)
    if (!activeCell) return
    let newRow = activeCell.row
    let newCol = activeCell.col

    switch (direction) {
      case "up":
        newRow = Math.max(1, activeCell.row - 1)
        break
      case "down":
        newRow = Math.min(9, activeCell.row + 1)
        break
      case "left":
        newCol = Math.max(1, activeCell.col - 1)
        break
      case "right":
        newCol = Math.min(9, activeCell.col + 1)
        break
    }

    this.setActiveCell(newRow, newCol)
  }

  public applyStatus(status: SudokuSnapshot) {
    if (status.values.length !== 81 || status.candidatesBinary.length !== 81) {
      alert("Estado de Sudoku inválido.")
      return
    }
    this.cells.forEach(cell => {
      const index = (cell.row - 1) * 9 + (cell.col - 1)
      cell.value = status.values[index]
      cell.candidates.forEach((candidate, value) => {
        candidate.isHidden =
          (status.candidatesBinary[index] & (1 << (value - 1))) === 0
      })
    })
  }

  public undoStatus() {
    const erroredCells = this.cells
      .values()
      .filter(cell => cell.errorValue > 0)
      .toArray()
    if (erroredCells.length > 0) {
      erroredCells.forEach(cell => {
        cell.errorValue = 0
      })
      return
    }

    if (this.history.length <= 1) {
      alert("No hay historial para deshacer.")
      return
    }

    this.history.pop()
    const lastStatus = this.history[this.history.length - 1]
    this.applyStatus(lastStatus)
  }

  public setValueForActiveCells(value: number) {
    if (this.mode === SudokuMode.Normal) {
      console.log("Setting value for active cells:", value)
      for (const cell of this.cells
        .values()
        .filter(c => c.active && !c.isGiven)) {
        console.log(
          `Setting value ${value} for cell at (${cell.row}, ${cell.col})`
        )
        this.setCellValue(cell.row, cell.col, value)
        this.removeRelatedCandidates(cell)

        if (value > 0) {
          const completed = this.cells
            .values()
            .every(c => c.value > 0 && !c.errorValue)
          if (completed) {
            this.status = SudokuStatus.Completed
          }
        }
      }
    } else if (this.mode === SudokuMode.Annotate) {
      console.log("Toggling candidates for active cells:", value)
      for (const cell of this.cells
        .values()
        .filter(c => c.active && c.value === 0)) {
        const candidate = cell.candidates.get(value)
        if (candidate) {
          candidate.isHidden = !candidate.isHidden
        }
      }
    }
    this.saveHistory()
  }

  public removeRelatedCandidates(valuedCell: Cell) {
    this.cells
      .values()
      .filter(cell => {
        const relatedCell =
          cell.row === valuedCell.row ||
          cell.col === valuedCell.col ||
          cell.boxNumber === valuedCell.boxNumber
        const differentCell =
          cell.row !== valuedCell.row || cell.col !== valuedCell.col
        const emptyCell = cell.value === 0
        return relatedCell && differentCell && emptyCell
      })
      .forEach(cell => {
        const candidate = cell.candidates.get(valuedCell.value)
        if (!candidate || candidate.isHidden) return
        candidate.isHidden = true
      })
  }

  public saveHistory() {
    const values = Array.from(this.cells.values()).map(cell => cell.value)
    const candidatesBinary = Array.from(this.cells.values()).map(cell => {
      let binary = 0
      cell.candidates.forEach(candidate => {
        if (!candidate.isHidden) {
          binary |= 1 << (candidate.value - 1)
        }
      })
      return binary
    })
    if (this.history.length > 0) {
      const lastSnapshot = this.history[this.history.length - 1]
      if (
        JSON.stringify(lastSnapshot.values) === JSON.stringify(values) &&
        JSON.stringify(lastSnapshot.candidatesBinary) ===
          JSON.stringify(candidatesBinary)
      ) {
        return // No changes, do not save
      }
    }
    this.history.push({ values, candidatesBinary })
  }

  public computeCandidates() {
    this.cells
      .values()
      .filter(cell => cell.value === 0)
      .forEach(cell => {
        cell.candidates.forEach(candidate => {
          if (!candidate.isHidden) return
          candidate.isHidden = false
        })
      })
    this.cells
      .values()
      .filter(cell => cell.value > 0)
      .forEach(valuedCell => {
        this.removeRelatedCandidates(valuedCell)
      })
    this.saveHistory()
  }
}
