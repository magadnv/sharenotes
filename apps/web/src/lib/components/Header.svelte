<script lang="ts">
  export let title = 'ShareNotes';
  export let subtitle: string | null = null;
</script>

<header class="border-b border-black/5 bg-white/80 backdrop-blur">
  <div class="mx-auto max-w-3xl px-5 py-4">
    <div class="flex items-baseline justify-between">
      <h1 class="text-lg font-semibold tracking-tight">{title}</h1>
      {#if subtitle}
        <p class="text-xs text-black/60">{subtitle}</p>
      {/if}
    </div>
  </div>
</header>