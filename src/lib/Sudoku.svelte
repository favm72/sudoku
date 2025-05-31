<script lang="ts">
  import { onDestroy } from "svelte"
  import { writable } from "svelte/store"
  import { cellKey } from "./brain"
  import { startSolving, sudoku } from "./sudoku.store"
  import SudokuCell from "./SudokuCell.svelte"

  const rowsIndex = Array.from({ length: 9 }, (_, i) => i + 1)
  const colsIndex = Array.from({ length: 9 }, (_, i) => i + 1)

  // Timer logic
  let timer: any = null
  const time = writable(0)
  let running = false
  let finished = false

  function startGame() {
    startSolving()
    finished = false
    running = true
    time.set(0)
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
      time.update(t => t + 1)
    }, 1000)
  }

  function finishGame() {
    running = false
    finished = true
    if (timer) clearInterval(timer)
    timer = null
  }

  onDestroy(() => {
    if (timer) clearInterval(timer)
  })
</script>

<section class="sudoku-container">
  <section class="sudoku-board">
    {#each rowsIndex as row}
      {#each colsIndex as col}
        {#if $sudoku.cells.has(cellKey(row, col))}
          <SudokuCell cell={$sudoku.cells.get(cellKey(row, col))!} />
        {:else}
          <div class="cell">Empty</div>
        {/if}
      {/each}
    {/each}
  </section>
  <section class="sudoku-controls">
    <div class="sudoku-header">
      <h1 class="sudoku-title">Milena</h1>
    </div>
    <span class="timer">
      <svg class="clock-icon" viewBox="0 0 24 24" width="24" height="24"
        ><circle
          cx="12"
          cy="12"
          r="10"
          stroke="#1976d2"
          stroke-width="2"
          fill="none"
        /><line
          x1="12"
          y1="12"
          x2="12"
          y2="7"
          stroke="#1976d2"
          stroke-width="2"
          stroke-linecap="round"
        /><line
          x1="12"
          y1="12"
          x2="16"
          y2="12"
          stroke="#1976d2"
          stroke-width="2"
          stroke-linecap="round"
        /></svg
      >
      {$time} s
    </span>
    <button class="start-btn" on:click={startGame} disabled={running}
      >Comenzar</button
    >
    <button class="finish-btn" on:click={finishGame} disabled={!running}
      >Finalizar</button
    >
    {#if finished}
      <span class="finished">Juego finalizado</span>
    {/if}
  </section>
</section>

<style lang="scss">
  .sudoku-header {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 2rem;
    margin-bottom: 2rem;
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
  .sudoku-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1.2rem;
    min-width: 180px;
  }
  .sudoku-controls .timer {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 1.3rem;
    color: #1976d2;
    background: #f5faff;
    border-radius: 1.5rem;
    padding: 0.3rem 1.1rem 0.3rem 0.7rem;
    box-shadow: 0 1px 4px #1976d220;
  }
  .sudoku-controls .clock-icon {
    margin-right: 0.5rem;
    vertical-align: middle;
  }
  .sudoku-controls .start-btn,
  .sudoku-controls .finish-btn {
    font-size: 1rem;
    padding: 0.5rem 1.2rem;
    border: none;
    border-radius: 1.2rem;
    background: linear-gradient(90deg, #1976d2 60%, #42a5f5 100%);
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.2s,
      box-shadow 0.2s;
    box-shadow: 0 2px 8px #1976d220;
    margin-bottom: 0.2rem;
  }
  .sudoku-controls .finish-btn {
    background: linear-gradient(90deg, #d32f2f 60%, #f44336 100%);
    margin-bottom: 0;
  }
  .sudoku-controls .start-btn:disabled,
  .sudoku-controls .finish-btn:disabled {
    background: #bdbdbd;
    color: #eee;
    cursor: not-allowed;
    box-shadow: none;
  }
  .sudoku-controls .finished {
    color: #1976d2;
    font-weight: bold;
    margin-top: 0.5rem;
    font-size: 1.1rem;
    letter-spacing: 0.04em;
  }
  .sudoku-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
  }
  .sudoku-board {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    gap: 1px;
    border: 1px solid black;
    background: #222;
  }
</style>
