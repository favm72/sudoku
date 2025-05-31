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
    } else if (e.key === "Backspace" || e.key === "Delete") {
      setValueForActiveCells(0)
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
    background-color: #fff;
    color: #222;
    font-size: 2rem;
    box-sizing: border-box;
    aspect-ratio: 1;
    width: 100%;
    height: auto;
    border: 1.5px solid #b0b0b0;
    transition:
      background 0.15s,
      color 0.15s,
      outline 0.15s;
    cursor: pointer;
    position: relative;
    &.candidates {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      padding: 0.1rem;
      background: #f7f7f7;
      font-size: 1rem;
      > div {
        text-align: center;
        font-size: 0.85rem;
        color: #1976d2;
        width: 100%;
        height: auto;
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
</style>
