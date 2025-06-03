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

  function getThemeColor(varName: string) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim()
  }

  function drawBoard() {
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, boardPx, boardPx)
    // Get theme colors
    const themeMain = getThemeColor("--theme-main")
    const themeAccent = getThemeColor("--theme-accent")
    const themeLight = getThemeColor("--theme-light")
    const themeBg = getThemeColor("--theme-bg")
    const themeContrast = getThemeColor("--theme-contrast")
    // Use Montserrat font for all text
    ctx.font = `bold ${cellSize * 0.6}px Montserrat, Arial`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    const board = get(sudoku)
    // Draw grid
    for (let i = 0; i <= size; i++) {
      ctx.lineWidth = i % 3 === 0 ? 3 : 1
      ctx.strokeStyle = i % 3 === 0 ? themeMain : "#b0b0b0"
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
          ctx.fillStyle = cell.errorValue ? "#ffcccc" : themeLight
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
            ? themeMain
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
          ctx.font = `${cellSize * 0.28}px Montserrat, Arial`
          ctx.fillStyle = themeMain
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
          ctx.strokeStyle = themeMain
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

  let gifTimer: number | null = null
  let renderGifMoving = $state(0)

  onMount(() => {
    const unsubscribe = sudoku.subscribe(() => {
      drawBoard()

      if (get(sudoku).status === SudokuStatus.Completed) {
        running = false
        gifTimer = setInterval(() => {
          renderGifMoving++
        }, 2000)
      }

      if (get(sudoku).status === SudokuStatus.Failed) {
        running = true
        startedAt = new Date()
        if (id) {
          loadSudoku(id)
        }
      }
    })

    if (id) {
      loadSudoku(id)
      running = true
      startedAt = new Date()
    }

    // Initial draw
    drawBoard()

    // Observe theme changes
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          drawBoard()
        }
      }
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })

    return () => {
      unsubscribe()
      observer.disconnect()
      if (gifTimer) {
        clearInterval(gifTimer)
      }
    }
  })
</script>

<section class="sudoku-container">
  <div class="sudoku-header">
    <h1 class="sudoku-title">Milena</h1>
    <SudokuTimer {running} startTime={startedAt} />
  </div>
  -
  {#if $sudoku.status === SudokuStatus.Completed}
    <div class="success-message">
      <p>¡Felicidades! Sudoku completado.</p>
      <img
        src="https://www.icegif.com/wp-content/uploads/2022/06/icegif-247.gif?tick={renderGifMoving}"
        alt="Sudoku completado"
        width="200"
      />
    </div>
  {/if}
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
    color: var(--theme-main);
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
    background: var(--theme-bg);
    border: 2.5px solid var(--theme-main);
    box-shadow: 0 2px 12px var(--theme-main) 20;
    touch-action: manipulation;
    max-width: 98vw;
    height: auto;
    display: block;
    margin: 0 auto;
  }
  .success-message {
    background: linear-gradient(
      90deg,
      var(--theme-green-light) 60%,
      var(--theme-green-bg) 100%
    );
    color: var(--theme-green-main);
    border: 2px solid var(--theme-green-main);
    border-radius: 1.2rem;
    padding: 1.2rem 2rem;
    margin: 1.5rem auto 1rem auto;
    font-size: 1.3rem;
    font-family: "Montserrat", Arial, sans-serif;
    font-weight: 600;
    box-shadow: 0 2px 12px #388e3c22;
    text-align: center;
    max-width: 420px;
    animation: pop-in 0.5s;
  }
  @keyframes shake {
    10%,
    90% {
      transform: translateX(-2px);
    }
    20%,
    80% {
      transform: translateX(4px);
    }
    30%,
    50%,
    70% {
      transform: translateX(-8px);
    }
    40%,
    60% {
      transform: translateX(8px);
    }
  }
  @keyframes pop-in {
    0% {
      transform: scale(0.7);
      opacity: 0;
    }
    80% {
      transform: scale(1.05);
      opacity: 1;
    }
    100% {
      transform: scale(1);
    }
  }
</style>
