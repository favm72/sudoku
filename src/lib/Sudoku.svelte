<script lang="ts">
  import { cellKey } from "./brain"
  import { sudoku } from "./sudoku.store"
  import SudokuCell from "./SudokuCell.svelte"

  const rowsIndex = Array.from({ length: 9 }, (_, i) => i + 1)
  const colsIndex = Array.from({ length: 9 }, (_, i) => i + 1)
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
</section>

<style lang="scss">
  .sudoku-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    // Center the board in the viewport
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
