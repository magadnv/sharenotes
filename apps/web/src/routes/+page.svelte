<script lang="ts">
  import { onMount } from 'svelte';

  let q = '';
  // Platzhalter-Daten – später durch echte Suche ersetzen
  let results = [
    {
      id: '1',
      title: 'Facade – Kurz & Klar',
      excerpt: 'Ein Design Pattern, das eine einzige, einfache Schnittstelle zu einem komplexen System bietet.',
      meta: 'Design Pattern · 5 fanden es hilfreich'
    },
    {
      id: '2',
      title: 'Photosynthese – Essenz',
      excerpt: 'Lichtreaktion vs. Dunkelreaktion auf einer halben Seite erklärt.',
      meta: 'Biologie · 3 fanden es hilfreich'
    }
  ];

  function onSubmit(e: Event) {
    e.preventDefault();
    // später: navigate to /search?q=...
  }

  onMount(() => {
    // Fokus sofort auf die Suche: reduziert Reibung
    const el = document.getElementById('q') as HTMLInputElement | null;
    el?.focus();
  });
</script>

<section aria-labelledby="search">
  <h2 id="search" class="sr-only">Suche</h2>
  <form on:submit={onSubmit} class="relative">
    <label for="q" class="sr-only">Thema suchen</label>
    <input
      id="q"
      name="q"
      bind:value={q}
      placeholder="Thema, Fach oder Begriff eingeben …"
      autocomplete="off"
      class="w-full rounded-2xl border border-black/10 bg-white px-5 py-4 text-base outline-none ring-0 focus:border-black/30"
    />
    <div class="mt-2 text-xs text-black/50">
      Tippe und drücke Enter. Später: Live-Ergebnisse in Echtzeit.
    </div>
  </form>
</section>

<section aria-labelledby="results" class="mt-10">
  <h2 id="results" class="sr-only">Ergebnisse</h2>

  {#if results.length === 0}
    <p class="text-sm text-black/50">Keine Ergebnisse. Versuche es mit einem allgemeineren Begriff.</p>
  {:else}
    <ul class="space-y-4">
      {#each results as item}
        <li class="rounded-2xl border border-black/5 bg-white p-5 transition-shadow hover:shadow-sm">
          <a href={"/note/" + item.id} class="block">
            <h3 class="text-base font-semibold tracking-tight">{item.title}</h3>
            <p class="mt-2 text-sm leading-relaxed text-black/70">{item.excerpt}</p>
            <div class="mt-3 text-xs text-black/45">{item.meta}</div>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</section>