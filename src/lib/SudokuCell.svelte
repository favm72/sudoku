<script lang="ts">
  import type { Cell } from "./brain"
  import {
    moveActiveCell,
    setActiveCell,
    setValueForActiveCells,
  } from "./sudoku.store"
  export let cell: Cell

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
    }
  }
</script>

{#if cell.value > 0}
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
    class="cell candidates"
    class:active={cell.active}
    on:click={handleClick}
    tabindex="0"
    role="button"
    on:keydown={handleKeydown}
  >
    {#each cell.candidates.values() as candidate}
      <div>{candidate.isHidden ? "" : candidate.value}</div>
    {/each}
  </div>
{/if}

<style lang="scss">
  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--cell-bg, white);
    color: var(--cell-text, black);
    font-size: 1.5rem;
    box-sizing: border-box;
    aspect-ratio: 1;
    width: 100%;
    height: auto;
    &.candidates {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      padding: 0.2rem;
      > div {
        text-align: center;
        font-size: 0.7rem;
        width: 100%;
        height: auto;
        aspect-ratio: 1;
      }
    }
    &.active {
      outline: 2px solid #1976d2;
      z-index: 1;
    }
    &.given {
      color: #1976d2;
      font-weight: bold;
    }
    &.user {
      color: #111;
      font-weight: bold;
    }
  }
</style>
