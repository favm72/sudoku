<script lang="ts">
  import { SudokuMode } from "./brain"
  import {
    computeCandidates,
    setValueForActiveCells,
    sudoku,
    toggleAnnotation,
    undoStatus,
  } from "./sudoku.store"
</script>

<section class="sudoku-numpad">
  {#each Array.from({ length: 9 }, (_, i) => i + 1) as n}
    <button
      class="numpad-btn{$sudoku.mode === SudokuMode.Annotate
        ? ' annotate-mode'
        : ''}"
      onclick={() => setValueForActiveCells(n)}
    >
      {#if $sudoku && $sudoku.cells && Array.from($sudoku.cells.values()).filter(cell => cell.value === n).length === 9}
        <span class="star-badge" title="Todos los {n} están en el tablero">
          ★
        </span>
      {:else}
        {n}
      {/if}
    </button>
  {/each}

  <button class="numpad-btn delete" onclick={undoStatus} aria-label="Borrar">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g><g id="SVGRepo_iconCarrier">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.53033 3.46967C7.82322 3.76256 7.82322 4.23744 7.53033 4.53033L5.81066 6.25H15C18.1756 6.25 20.75 8.82436 20.75 12C20.75 15.1756 18.1756 17.75 15 17.75H8.00001C7.58579 17.75 7.25001 17.4142 7.25001 17C7.25001 16.5858 7.58579 16.25 8.00001 16.25H15C17.3472 16.25 19.25 14.3472 19.25 12C19.25 9.65279 17.3472 7.75 15 7.75H5.81066L7.53033 9.46967C7.82322 9.76256 7.82322 10.2374 7.53033 10.5303C7.23744 10.8232 6.76256 10.8232 6.46967 10.5303L3.46967 7.53033C3.17678 7.23744 3.17678 6.76256 3.46967 6.46967L6.46967 3.46967C6.76256 3.17678 7.23744 3.17678 7.53033 3.46967Z"
        ></path>
      </g></svg
    >
  </button>

  <button
    class="numpad-btn compute"
    onclick={computeCandidates}
    aria-label="Compute"
  >
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"
      ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g><g id="SVGRepo_iconCarrier">
        <defs>
          <style>
            .cls-1 {
              fill: var(--theme-main);
            }
            .cls-2 {
              fill: var(--theme-accent);
            }
            .cls-3 {
              fill: var(--theme-bg);
            }
          </style>
        </defs> <title>Icon_24px_ComputeEngine_Color</title>
        <g data-name="Product Icons">
          <rect class="cls-1" x="9" y="9" width="6" height="6"></rect>
          <rect class="cls-2" x="11" y="2" width="2" height="4"></rect>
          <rect class="cls-2" x="7" y="2" width="2" height="4"></rect>
          <rect class="cls-2" x="15" y="2" width="2" height="4"></rect>
          <rect class="cls-3" x="11" y="18" width="2" height="4"></rect>
          <rect class="cls-3" x="7" y="18" width="2" height="4"></rect>
          <rect class="cls-3" x="15" y="18" width="2" height="4"></rect>
          <rect
            class="cls-3"
            x="19"
            y="10"
            width="2"
            height="4"
            transform="translate(8 32) rotate(-90)"
          ></rect>
          <rect
            class="cls-3"
            x="19"
            y="14"
            width="2"
            height="4"
            transform="translate(4 36) rotate(-90)"
          ></rect>
          <rect
            class="cls-3"
            x="19"
            y="6"
            width="2"
            height="4"
            transform="translate(12 28) rotate(-90)"
          ></rect>
          <rect
            class="cls-2"
            x="3"
            y="10"
            width="2"
            height="4"
            transform="translate(-8 16) rotate(-90)"
          ></rect>
          <rect
            class="cls-2"
            x="3"
            y="14"
            width="2"
            height="4"
            transform="translate(-12 20) rotate(-90)"
          ></rect>
          <rect
            class="cls-2"
            x="3"
            y="6"
            width="2"
            height="4"
            transform="translate(-4 12) rotate(-90)"
          ></rect> <path class="cls-1" d="M5,5V19H19V5ZM17,17H7V7H17Z"></path>
          <polygon class="cls-2" points="9 15 15 15 12 12 9 15"></polygon>
          <polygon class="cls-3" points="12 12 15 15 15 9 12 12"></polygon>
        </g>
      </g></svg
    >
  </button>

  <button
    class="numpad-btn {$sudoku.mode === SudokuMode.Annotate
      ? ' annotate'
      : ' annotate-mode'}"
    onclick={toggleAnnotation}
    aria-label="Modo anotación"
  >
    <svg
      width="32"
      height="32"
      viewBox="0 0 512 512"
      style="display:block;max-width:100%;max-height:100%;"
    >
      <g>
        <path
          d="M497.207,88.4l-73.634-73.607c-19.721-19.712-51.646-19.73-71.375-0.018l-47.733,47.733L71.214,295.812 c-9.671,9.67-17.066,21.341-21.694,34.201L2.243,461.593c-4.93,13.731-1.5,29.064,8.817,39.381 c10.309,10.309,25.66,13.74,39.382,8.8l131.563-47.293c12.86-4.62,24.539-12.032,34.201-21.686L437.011,219.98l0.009,0.009 l12.48-12.498l47.707-47.725l0.017-0.017C516.859,140.046,516.936,108.138,497.207,88.4z M96.175,320.773L327.686,89.219 l41.303,41.303L133.91,365.601l-41.088-41.079C93.899,323.238,94.985,321.962,96.175,320.773z M170.067,429.254l-83.83,30.133 L52.631,425.78l30.124-83.822c0.215-0.612,0.517-1.19,0.749-1.793l88.347,88.338C171.248,428.745,170.67,429.038,170.067,429.254z M191.244,415.834c-1.19,1.181-2.465,2.275-3.749,3.353l-41.106-41.104l235.08-235.08l41.294,41.294L191.244,415.834z M472.237,134.814l-35.226,35.235l-1.767,1.767l-95.078-95.078l37.002-37.002c5.913-5.887,15.506-5.895,21.445,0.026l73.625,73.599 c5.922,5.904,5.93,15.498-0.026,21.47L472.237,134.814z"
        ></path>
      </g>
    </svg>
  </button>
</section>

<style lang="scss">
  .sudoku-numpad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 0.3rem;
    padding: 1rem;
    background: white;
  }
  .star-badge {
    font-size: 1.8rem;
    color: var(--theme-main);
    background: var(--theme-contrast);
    border-radius: 50%;
    padding: 0.1em 0.3em;
    font-weight: bold;
    box-shadow: 0 1px 4px #0002;
    pointer-events: none;
    z-index: 2;
    line-height: 1;
  }
  .numpad-btn {
    position: relative;
    font-family: "Montserrat", Arial, sans-serif;
    font-size: 2rem;
    width: 64px;
    height: 64px;
    border-radius: 1.2rem;
    border: solid 2px var(--theme-main);
    background: var(--theme-bg);
    color: var(--theme-main);
    font-weight: 700;
    box-shadow: 0 1px 4px var(--theme-main) 20;
    cursor: pointer;
    transition:
      background 0.15s,
      color 0.15s,
      font-size 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;

    svg {
      width: 32px;
      height: 32px;
      max-width: 100%;
      max-height: 100%;
      display: block;
      margin: 0 auto;
      pointer-events: none;
      fill: var(--theme-main);
      stroke: var(--theme-main);
    }

    &:active {
      background: var(--theme-accent);
    }

    &.delete {
      background: var(--theme-bg);
      color: var(--theme-main);
      font-size: 1.3rem;
      width: 64px;
      height: 64px;
      justify-content: center;
      align-items: center;
    }
    &.compute {
      background: white;
      color: var(--theme-main);
      width: 64px;
      height: 64px;
    }
    &.annotate {
      background: white;
      color: var(--theme-main);
      width: 64px;
      height: 64px;
    }
    &.annotate-mode {
      font-size: 1.2rem;

      svg {
        fill: var(--theme-light);
        stroke: var(--theme-light);
      }
    }
  }
</style>
