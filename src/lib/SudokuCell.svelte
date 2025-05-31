<script lang="ts">
  import type { Cell } from "./brain"
  import {
    moveActiveCell,
    setActiveCell,
    setValueForActiveCells,
  } from "./sudoku.store"
  export let cell: Cell
  export let showCandidates: boolean = true

  function handleClick(event: MouseEvent | KeyboardEvent) {
    const multi = event instanceof MouseEvent ? event.ctrlKey : event.ctrlKey
    setActiveCell(cell.row, cell.col, multi)
  }

  function handleKeydown(e: KeyboardEvent) {
    e.preventDefault()
    if (e.key === "Enter" || e.key === " ") {
      handleClick(e)
    } else if (/^[1-9]$/.test(e.key)) {
      setValueForActiveCells(Number(e.key))
    } else if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      if (e.key === "ArrowUp") moveActiveCell("up")
      if (e.key === "ArrowDown") moveActiveCell("down")
      if (e.key === "ArrowLeft") moveActiveCell("left")
      if (e.key === "ArrowRight") moveActiveCell("right")
    } else if (e.key === "Backspace" || e.key === "Delete") {
      setValueForActiveCells(0)
    }
  }
</script>

{#if !showCandidates}
  <div
    class="cell {cell.isGiven ? 'given' : 'user'}"
    class:active={cell.active}
    on:click={handleClick}
    tabindex="0"
    role="button"
    on:keydown={handleKeydown}
  >
    {cell.value || ""}
  </div>
{:else}
  <div
    class="cell {showCandidates && !cell.isGiven && cell.value === 0
      ? 'candidates'
      : ''}"
    class:active={cell.active}
    on:click={handleClick}
    tabindex="0"
    role="button"
    on:keydown={handleKeydown}
  >
    {#if !showCandidates || cell.value > 0}
      <div class="value">{cell.value}</div>
    {:else}
      {#each cell.candidates.values() as candidate}
        <div>{candidate.isHidden ? "" : candidate.value}</div>
      {/each}
    {/if}
  </div>
{/if}

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap");

  .cell {
    font-family: "Montserrat", Arial, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    color: #222;
    font-size: 2.4rem;
    box-sizing: border-box;
    aspect-ratio: 1;
    width: 3rem;
    height: 3rem;
    border: 1px solid #c0c0c0;
    border-top-width: 1px;
    border-left-width: 1px;
    border-bottom-width: 1px;
    border-right-width: 1px;
    transition:
      background 0.15s,
      color 0.15s,
      outline 0.15s;
    cursor: pointer;
    position: relative;
    // Bordes gruesos para bloques 3x3
    &:nth-child(3n + 1) {
      border-left-width: 2.5px;
      border-left-color: #001830;
    }
    &:nth-child(n + 19):nth-child(-n + 27),
    &:nth-child(n + 46):nth-child(-n + 54),
    &:nth-child(n + 73):nth-child(-n + 81) {
      border-bottom-width: 2.5px;
      border-bottom-color: #001830;
    }
    &.candidates {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      > div {
        text-align: center;
        font-size: 1rem;
        color: #1976d2;
        width: 100%;
        height: 100%;
        aspect-ratio: 1;
        opacity: 0.85;
        font-weight: 500;
      }
    }
    &.active {
      outline: 2.5px solid #1976d2;
      z-index: 2;
      background: #e3f0fc;
    }
    &.given {
      color: #1976d2;
      font-weight: 700;
      background: #f7faff;
    }
    &.user {
      color: #222;
      font-weight: 700;
      background: #fff;
    }
    &:hover {
      background: #eaf4fd;
    }
  }

  .sudoku-board {
    width: 630px;
    height: 630px;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    gap: 0;
    border: 2.5px solid #1976d2;
    background: #222;
  }
</style>
