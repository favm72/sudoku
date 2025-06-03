<script lang="ts">
  import { onMount } from "svelte"
  import { get } from "svelte/store"
  import { cellKey, SudokuStatus } from "./brain"
  import { loadSudoku, setActiveCell, sudoku } from "./sudoku.store"
  import SudokuNumpad from "./SudokuNumpad.svelte"
  import SudokuTimer from "./SudokuTimer.svelte"

  const { id } = $props<{ id?: string }>()

  let running = $state(false)
  let startedAt: Date | null = $state(null)

  let canvas: HTMLCanvasElement
  const size = 9
  let cellSize = 60 // px
  let boardPx = cellSize * size

  function drawBoard() {
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, boardPx, boardPx)
    // Use Montserrat font for all text
    ctx.font = `bold ${cellSize * 0.6}px Montserrat, Arial`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    const board = get(sudoku)
    // Draw grid
    for (let i = 0; i <= size; i++) {
      ctx.lineWidth = i % 3 === 0 ? 3 : 1
      ctx.strokeStyle = i % 3 === 0 ? "#1976d2" : "#b0b0b0"
      // Vertical
      ctx.beginPath()
      ctx.moveTo(i * cellSize, 0)
      ctx.lineTo(i * cellSize, boardPx)
      ctx.stroke()
      // Horizontal
      ctx.beginPath()
      ctx.moveTo(0, i * cellSize)
      ctx.lineTo(boardPx, i * cellSize)
      ctx.stroke()
    }
    // Draw numbers and candidates
    for (let row = 1; row <= size; row++) {
      for (let col = 1; col <= size; col++) {
        const cell = board.cells.get(cellKey(row, col))
        if (!cell) continue
        const x = (col - 1) * cellSize + cellSize / 2
        const y = (row - 1) * cellSize + cellSize / 2
        // Fill background if highlighted
        if (cell.highLighted || cell.errorValue) {
          ctx.save()
          ctx.fillStyle = cell.errorValue ? "#ffcccc" : "#a3cff0"
          ctx.fillRect(
            (col - 1) * cellSize + 2,
            (row - 1) * cellSize + 2,
            cellSize - 4,
            cellSize - 4
          )
          ctx.restore()
        }
        if (cell.value > 0 || cell.errorValue) {
          ctx.font = `bold ${cellSize * 0.6}px Montserrat, Arial`
          ctx.fillStyle = cell.isGiven
            ? "#1976d2"
            : cell.errorValue
              ? "#d32f2f"
              : "#333"
          ctx.fillText(
            cell.errorValue
              ? String(cell.errorValue)
              : cell.value
                ? String(cell.value)
                : "",
            x,
            y + 2
          )
        } else {
          // Candidates (draw small)
          ctx.save()
          ctx.font = `${cellSize * 0.18}px Montserrat, Arial`
          ctx.fillStyle = "#1976d2"
          for (let n = 1; n <= 9; n++) {
            const cand = cell.candidates.get(n)
            if (cand && !cand.isHidden) {
              const cx = x + (((n - 1) % 3) - 1) * cellSize * 0.32
              const cy = y + (Math.floor((n - 1) / 3) - 1) * cellSize * 0.32
              ctx.fillText(String(n), cx, cy + 2)
            }
          }
          ctx.restore()
        }
        // Highlight active
        if (cell.active) {
          ctx.save()
          ctx.strokeStyle = "#1976d2"
          ctx.lineWidth = 3
          ctx.strokeRect(
            (col - 1) * cellSize + 2,
            (row - 1) * cellSize + 2,
            cellSize - 4,
            cellSize - 4
          )
          ctx.restore()
        }
      }
    }
  }

  function handleCanvasPointer(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY
    const cellSize = canvas.width / size
    const col = Math.floor(x / cellSize) + 1
    const row = Math.floor(y / cellSize) + 1
    setActiveCell(row, col)
  }

  onMount(() => {
    const unsubscribe = sudoku.subscribe(() => {
      drawBoard()

      if (get(sudoku).status === SudokuStatus.Completed) {
        alert("¡Sudoku completado!")
        running = false
        startedAt = new Date()
      }

      if (get(sudoku).status === SudokuStatus.Failed) {
        alert("¡Sudoku fallido! Intenta de nuevo.")
        running = false
        startedAt = null
      }
    })

    if (id) {
      loadSudoku(id)
      running = true
      startedAt = new Date()
    }

    // Initial draw
    drawBoard()
    return unsubscribe
  })
</script>

<section class="sudoku-container">
  <div class="sudoku-header">
    <h1 class="sudoku-title">Milena</h1>
    <SudokuTimer {running} startTime={startedAt} />
  </div>
  <section class="sudoku-board">
    <canvas
      bind:this={canvas}
      width={boardPx}
      height={boardPx}
      class="sudoku-canvas"
      onpointerdown={handleCanvasPointer}
      tabindex="0"
      aria-label="Tablero de Sudoku"
    ></canvas>
  </section>
  <SudokuNumpad />
</section>

<style lang="scss">
  .sudoku-header {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 2rem;
    padding: 1rem;
  }
  .sudoku-title {
    font-family: "Montserrat", Arial, sans-serif;
    font-size: 2.5rem;
    color: #1976d2;
    letter-spacing: 0.1em;
    margin: 0;
    padding-top: 0.5rem;
    text-shadow: 1px 1px 2px #eee;
  }
  .sudoku-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .sudoku-board {
    display: grid;
    place-items: center;
    width: 100%;
  }
  .sudoku-canvas {
    background: #fff;
    border: 2.5px solid #1976d2;
    box-shadow: 0 2px 12px #1976d220;
    touch-action: manipulation;
    max-width: 98vw;
    height: auto;
    display: block;
    margin: 0 auto;
  }
</style>
