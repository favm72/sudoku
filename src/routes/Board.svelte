<script lang="ts">
  import Sudoku from "../lib/Sudoku.svelte"

  export let params: { id?: string }
</script>

<Sudoku id={params.id} />
