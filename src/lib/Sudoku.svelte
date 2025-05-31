<script lang="ts">
  import { onDestroy } from "svelte"
  import { derived, writable } from "svelte/store"
  import { cellKey, sudokus } from "./brain"
  import {
    endSolving,
    loadSudoku,
    newCustomSudoku,
    setValueForActiveCells,
    startSolving,
    sudoku,
  } from "./sudoku.store"
  import SudokuCell from "./SudokuCell.svelte"

  const rowsIndex = Array.from({ length: 9 }, (_, i) => i + 1)
  const colsIndex = Array.from({ length: 9 }, (_, i) => i + 1)

  // Timer logic
  let timer: any = null
  const time = writable(0)
  let running = false
  let finished = false

  // Digital clock font formatting mm:ss
  const digitalTime = derived(time, $time => {
    const mm = String(Math.floor($time / 60)).padStart(2, "0")
    const ss = String($time % 60).padStart(2, "0")
    return `${mm}:${ss}`
  })

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
    endSolving()
  }

  function newExpertSudoku() {
    loadSudoku(sudokus[0])
  }

  onDestroy(() => {
    if (timer) clearInterval(timer)
  })

  let showCandidates = true

  function handleNumberInput(num: number) {
    // Llama a la función para poner el valor en las celdas activas
    setValueForActiveCells(num)
  }
  function handleDeleteInput() {
    setValueForActiveCells(0)
  }
</script>

<section class="sudoku-container">
  <section class="sudoku-board">
    {#each rowsIndex as row}
      {#each colsIndex as col}
        {#if $sudoku.cells.has(cellKey(row, col))}
          <SudokuCell
            cell={$sudoku.cells.get(cellKey(row, col))!}
            {showCandidates}
          />
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
    <span class="timer digital-font">
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
      {$digitalTime}
    </span>
    <button class="start-btn" on:click={newCustomSudoku} disabled={running}
      >Nuevo Custom</button
    >
    <button class="start-btn" on:click={newExpertSudoku} disabled={running}
      >Nuevo Experto</button
    >
    <button
      class="candidates-btn"
      on:click={() => (showCandidates = !showCandidates)}
    >
      {showCandidates ? "Ocultar candidatos" : "Mostrar candidatos"}
    </button>
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
  <section class="sudoku-numpad">
    <div class="numpad-row">
      {#each [1, 2, 3] as n}
        <button class="numpad-btn" on:click={() => handleNumberInput(n)}
          >{n}</button
        >
      {/each}
    </div>
    <div class="numpad-row">
      {#each [4, 5, 6] as n}
        <button class="numpad-btn" on:click={() => handleNumberInput(n)}
          >{n}</button
        >
      {/each}
    </div>
    <div class="numpad-row">
      {#each [7, 8, 9] as n}
        <button class="numpad-btn" on:click={() => handleNumberInput(n)}
          >{n}</button
        >
      {/each}
    </div>
    <div class="numpad-row">
      <button class="numpad-btn delete" on:click={handleDeleteInput}
        >Borrar</button
      >
    </div>
  </section>
</section>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap");
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
    font-size: 1.6rem;
    color: #1976d2;
    background: #f5faff;
    border-radius: 1.5rem;
    padding: 0.3rem 1.1rem 0.3rem 0.7rem;
    box-shadow: 0 1px 4px #1976d220;
  }
  .sudoku-controls .digital-font {
    font-family: "Share Tech Mono", "Courier New", Courier, monospace;
    letter-spacing: 0.08em;
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
  .sudoku-controls .candidates-btn {
    font-size: 1rem;
    padding: 0.5rem 1.2rem;
    border: none;
    border-radius: 1.2rem;
    background: linear-gradient(90deg, #43a047 60%, #81c784 100%);
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.2s,
      box-shadow 0.2s;
    box-shadow: 0 2px 8px #1976d220;
    margin-bottom: 0.2rem;
  }
  .sudoku-controls .candidates-btn:active {
    background: #388e3c;
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
  .sudoku-numpad {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
    gap: 0.3rem;
  }
  .numpad-row {
    display: flex;
    gap: 0.5rem;
  }
  .numpad-btn {
    font-family: "Montserrat", Arial, sans-serif;
    font-size: 2rem;
    width: 64px;
    height: 64px;
    border-radius: 1.2rem;
    border: none;
    background: #f5faff;
    color: #1976d2;
    font-weight: 700;
    box-shadow: 0 1px 4px #1976d220;
    cursor: pointer;
    transition:
      background 0.15s,
      color 0.15s;
  }
  .numpad-btn:active {
    background: #e3f0fc;
  }
  .numpad-btn.delete {
    background: linear-gradient(90deg, #d32f2f 60%, #f44336 100%);
    color: #fff;
    font-size: 1.3rem;
    width: 140px;
    height: 48px;
    margin-top: 0.2rem;
  }
</style>
