<script lang="ts">
  import { onMount } from "svelte"
  export let showLabel: boolean = true
  let theme = localStorage.getItem("sudoku-theme") || "blue"
  const themes = [
    { value: "blue", label: "Azul" },
    { value: "green", label: "Verde" },
    { value: "purple", label: "Púrpura" },
    { value: "red", label: "Rojo" },
    { value: "orange", label: "Naranja" },
  ]
  function handleThemeChange(event: Event) {
    const select = event.target as HTMLSelectElement
    setTheme(select.value)
  }
  function setTheme(newTheme: string) {
    theme = newTheme
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("sudoku-theme", theme)
  }
  onMount(() => {
    setTheme(theme)
  })
</script>

<div class="theme-selector">
  {#if showLabel}
    <label for="theme-select">Tema: </label>
  {/if}
  <select id="theme-select" bind:value={theme} on:change={handleThemeChange}>
    {#each themes as t}
      <option value={t.value}>{t.label}</option>
    {/each}
  </select>
</div>

<style lang="scss">
  .theme-selector {
    margin: 1.5rem auto 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    label {
      font-size: 1.1rem;
      margin-right: 0.5rem;
      color: var(--theme-blue-main);
      font-family: "Montserrat", Arial, sans-serif;
    }
    select {
      font-size: 1.1rem;
      border-radius: 0.5rem;
      padding: 0.3rem 1rem;
      font-family: "Montserrat", Arial, sans-serif;
    }
  }
</style>
