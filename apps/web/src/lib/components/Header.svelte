<script lang="ts">
  export let title = 'ShareNotes';
  export let subtitle: string | null = null;
</script>

<header class="border-b border-black/5 bg-white/80 backdrop-blur">
  <div class="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
    <!-- Titel / Logo -->
    <a
      href="/"
      class="text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity"
      data-sveltekit-prefetch
      aria-label="Zur Startseite"
    >
      {title}
    </a>

    <!-- Subtitle rechts -->
    {#if subtitle}
      <p class="text-xs text-black/60">{subtitle}</p>
    {/if}
  </div>
</header>