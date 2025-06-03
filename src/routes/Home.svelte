<script lang="ts">
  import { onMount } from "svelte"
  import { push } from "svelte-spa-router"
  import { sudokuDataset } from "../lib/dataset"
  import { clearSudoku } from "../lib/sudoku.store"
  import ThemeSelector from "../lib/ThemeSelector.svelte"
  const difficulties = [
    { label: "Fácil", id: "Very Easy" },
    { label: "Normal", id: "Easy" },
    { label: "Medio", id: "Medium" },
    { label: "Difícil", id: "Hard" },
    { label: "Experto", id: "Very Hard" },
    { label: "Extremo", id: "Extreme" },
    { label: "Personalizado", id: "Custom" },
  ]

  function randomBoard(difficulty: string) {
    const boards = sudokuDataset.filter(
      sudoku => sudoku.difficulty_level === difficulty
    )
    const randomIndex = Math.floor(Math.random() * boards.length)
    return boards[randomIndex]
  }

  async function startGame(difficulty: string) {
    const board = randomBoard(difficulty)
    await push(`/board/${board.id}`)
  }

  onMount(() => {
    clearSudoku()
  })
</script>

<main class="home-container">
  <h1>Sudoku</h1>
  <ThemeSelector />
  <p>Elige una dificultad para comenzar:</p>
  <div class="difficulty-buttons">
    {#each difficulties as diff}
      <button class="difficulty-btn" on:click={() => startGame(diff.id)}
        >{diff.label}</button
      >
    {/each}
  </div>
</main>

<style lang="scss">
  .home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    box-sizing: border-box;
    background: linear-gradient(
      120deg,
      var(--theme-bg) 60%,
      var(--theme-main) 100%
    );
    h1 {
      font-family: "Montserrat", Arial, sans-serif;
      font-size: 3rem;
      color: var(--theme-main);
      margin-bottom: 0.5em;
    }
    p {
      font-size: 1.3rem;
      color: #333;
      font-family: "Montserrat", Arial, sans-serif;
      margin-bottom: 2em;
    }
    .difficulty-buttons {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      width: 100%;
      max-width: 320px;
    }
    .difficulty-btn {
      font-family: "Montserrat", Arial, sans-serif;
      font-size: 1.5rem;
      padding: 1rem 0;
      border-radius: 1.2rem;
      border: solid 2px var(--theme-main);
      background: var(--theme-bg);
      color: var(--theme-main);
      font-weight: 700;
      box-shadow: 0 1px 4px var(--theme-main) 20;
      cursor: pointer;
      transition:
        background 0.15s,
        color 0.15s;
      &:hover,
      &:focus {
        background: var(--theme-main);
        color: #fff;
      }
    }
  }
</style>
