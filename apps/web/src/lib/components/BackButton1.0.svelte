<script lang="ts">
  import { goto } from '$app/navigation';

  export let label: string = 'Zurück';

  function goBack() {
    if (history.length > 1) {
      history.back();
    } else {
      goto('/'); // Fallback: Startseite
    }
  }
</script>

<button
  on:click={goBack}
  class="flex items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm text-black/70 shadow-sm backdrop-blur-sm transition hover:text-black hover:shadow"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
  </svg>
  {label}
</button>