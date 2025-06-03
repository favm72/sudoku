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
      color: var(--theme-main);
      font-family: "Montserrat", Arial, sans-serif;
    }
    select {
      appearance: none;
      min-width: 150px;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath fill='%23fff' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")
        no-repeat right 0.75rem center;
      background-color: var(--theme-bg);
      color: var(--theme-main);
      font-size: 1.1rem;
      border-radius: 0.5rem;
      padding: 0.3rem 1.5rem;
      font-family: "Montserrat", Arial, sans-serif;
    }
  }
</style>
