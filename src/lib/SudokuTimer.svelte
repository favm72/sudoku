<script lang="ts">
  const { startTime = new Date(), running = false } = $props()

  let timer: number | null = null
  let elapsed = $state(0)
  let digitalTime = $derived(formatTime(elapsed))

  function formatTime(seconds: number): string {
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0")
    const ss = String(seconds % 60).padStart(2, "0")
    return `${mm}:${ss}`
  }

  function startTimer() {
    timer = setInterval(() => {
      elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
    }, 1000)
  }

  $effect(() => {
    if (running) {
      startTimer()
    } else if (timer) {
      clearInterval(timer)
      timer = null
    }

    return () => {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }
  })
</script>

<span class="timer digital-font">
  <svg class="clock-icon" viewBox="0 0 24 24" width="24" height="24"
    ><circle cx="12" cy="12" r="10" stroke-width="2" fill="none" /><line
      x1="12"
      y1="12"
      x2="12"
      y2="7"
      stroke-width="2"
      stroke-linecap="round"
    /><line
      x1="12"
      y1="12"
      x2="16"
      y2="12"
      stroke-width="2"
      stroke-linecap="round"
    /></svg
  >
  {digitalTime}
</span>

<style>
  .timer {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 1.6rem;
    color: var(--theme-main);
    background: var(--theme-bg);
    border-radius: 1.5rem;
    padding: 0.3rem 1.1rem 0.3rem 0.7rem;
    box-shadow: 0 1px 4px var(--theme-main) 20;
  }
  .digital-font {
    font-family: "Share Tech Mono", "Courier New", Courier, monospace;
    letter-spacing: 0.08em;
  }
  .clock-icon {
    margin-right: 0.5rem;
    vertical-align: middle;
    fill: var(--theme-main);
    stroke: var(--theme-main);
  }
</style>
