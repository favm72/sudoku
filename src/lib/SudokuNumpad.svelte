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
      onclick={() => setValueForActiveCells(n)}>{n}</button
    >
  {/each}

  <button class="numpad-btn delete" onclick={undoStatus} aria-label="Borrar">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g><g id="SVGRepo_iconCarrier">
        <path
          d="M4 7H15C16.8692 7 17.8039 7 18.5 7.40193C18.9561 7.66523 19.3348 8.04394 19.5981 8.49999C20 9.19615 20 10.1308 20 12C20 13.8692 20 14.8038 19.5981 15.5C19.3348 15.9561 18.9561 16.3348 18.5 16.5981C17.8039 17 16.8692 17 15 17H8.00001M4 7L7 4M4 7L7 10"
          stroke="#1C274C"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
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
              fill: #aecbfa;
            }
            .cls-2 {
              fill: #669df6;
            }
            .cls-3 {
              fill: #4285f4;
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
    class="numpad-btn annotate"
    onclick={toggleAnnotation}
    aria-label="Modo anotación"
  >
    <svg
      height="200px"
      width="200px"
      version="1.1"
      id="_x32_"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      xml:space="preserve"
      fill="#000000"
      stroke="#000000"
      stroke-width="0.00512"
      ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g><g id="SVGRepo_iconCarrier">
        <style type="text/css">
          .st0 {
            fill: #000000;
          }
        </style>
        <g>
          <path
            class="st0"
            d="M497.207,88.4l-73.634-73.607c-19.721-19.712-51.646-19.73-71.375-0.018l-47.733,47.733L71.214,295.812 c-9.671,9.67-17.066,21.341-21.694,34.201L2.243,461.593c-4.93,13.731-1.5,29.064,8.817,39.381 c10.309,10.309,25.66,13.74,39.382,8.8l131.563-47.293c12.86-4.62,24.539-12.032,34.201-21.686L437.011,219.98l0.009,0.009 l12.48-12.498l47.707-47.725l0.017-0.017C516.859,140.046,516.936,108.138,497.207,88.4z M96.175,320.773L327.686,89.219 l41.303,41.303L133.91,365.601l-41.088-41.079C93.899,323.238,94.985,321.962,96.175,320.773z M170.067,429.254l-83.83,30.133 L52.631,425.78l30.124-83.822c0.215-0.612,0.517-1.19,0.749-1.793l88.347,88.338C171.248,428.745,170.67,429.038,170.067,429.254z M191.244,415.834c-1.19,1.181-2.465,2.275-3.749,3.353l-41.106-41.104l235.08-235.08l41.294,41.294L191.244,415.834z M472.237,134.814l-35.226,35.235l-1.767,1.767l-95.078-95.078l37.002-37.002c5.913-5.887,15.506-5.895,21.445,0.026l73.625,73.599 c5.922,5.904,5.93,15.498-0.026,21.47L472.237,134.814z"
          ></path>
        </g>
      </g></svg
    >
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
  .numpad-btn {
    font-family: "Montserrat", Arial, sans-serif;
    font-size: 2rem;
    width: 64px;
    height: 64px;
    border-radius: 1.2rem;
    border: solid 2px #1976d2;
    background: #f5faff;
    color: #1976d2;
    font-weight: 700;
    box-shadow: 0 1px 4px #1976d220;
    cursor: pointer;
    transition:
      background 0.15s,
      color 0.15s,
      font-size 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;

    &:active {
      background: #e3f0fc;
    }

    &.delete {
      background: linear-gradient(90deg, #d32f2f 60%, #f44336 100%);
      color: #fff;
      font-size: 1.3rem;
      width: 64px;
      height: 64px;
      justify-content: center;
      align-items: center;

      svg {
        display: block;
      }
    }
    &.compute {
      background: white;
      color: #1976d2;
      width: 64px;
      height: 64px;

      svg {
        display: block;
      }
    }
    &.annotate {
      background: white;
      color: #1976d2;
      width: 64px;
      height: 64px;

      svg {
        display: block;
      }
    }
    &.annotate-mode {
      font-size: 1.2rem;
    }
  }
</style>
