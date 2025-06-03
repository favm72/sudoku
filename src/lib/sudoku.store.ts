import { get, writable } from "svelte/store"
import { Sudoku } from "./brain"

const initialSudoku = new Sudoku()
export const sudoku = writable<Sudoku>(initialSudoku)

export function setValueForActiveCells(value: number) {
  const instance = get(sudoku)
  instance.setValueForActiveCells(value)
  sudoku.update(() => instance)
}

export function computeCandidates() {
  const instance = get(sudoku)
  instance.computeCandidates()
  sudoku.update(() => instance)
}

export function setActiveCell(row: number, col: number, multi = false) {
  const instance = get(sudoku)
  instance.setActiveCell(row, col, multi)
  sudoku.update(() => instance)
}

export function moveActiveCell(direction: "up" | "down" | "left" | "right") {
  const instance = get(sudoku)
  instance.moveActiveCell(direction)
  sudoku.update(() => instance)
}

export function startSolving() {
  const instance = get(sudoku)
  instance.StartSolving()
  sudoku.update(() => instance)
}

export function newCustomSudoku() {
  const instance = get(sudoku)
  instance.newCustomSudoku()
  sudoku.update(() => instance)
}

export function loadSudoku(line: string) {
  const instance = get(sudoku)
  instance.loadSudoku(line)
  sudoku.update(() => instance)
}

export function undoStatus() {
  const instance = get(sudoku)
  instance.undoStatus()
  sudoku.update(() => instance)
}

export function toggleAnnotation() {
  const instance = get(sudoku)
  instance.toggleAnnotation()
  sudoku.update(() => instance)
}
