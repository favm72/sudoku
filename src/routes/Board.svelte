<script lang="ts">
  import Sudoku from "../lib/Sudoku.svelte"
  import ThemeSelector from "../lib/ThemeSelector.svelte"

  export let params: { id?: string }
</script>

<ThemeSelector />

<Sudoku id={params.id} />
