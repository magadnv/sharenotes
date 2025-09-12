<script lang="ts">
  import { goto } from '$app/navigation';

  export let label: string = 'Zurück';

  function goBack() {
    if (history.length > 1) {
      history.back();
    } else {
      goto('/');
    }
  }
</script>

<button
  on:click={goBack}
  class="group flex items-center gap-1 text-sm font-medium text-black/50 hover:text-black transition-colors"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-4 w-4 -ml-1 text-black/40 group-hover:text-black"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
  </svg>
  {label}
</button>