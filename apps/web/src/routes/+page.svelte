<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { showTopHelpful } from '$lib/stores/prefs';
  import { NotesFacade } from '$lib/facade/notes';
  import SegmentedToggle from '$lib/components/SegmentedToggle.svelte';
  import { get } from 'svelte/store';

  let q = '';
  let mode: 'focus' | 'popular' = get(showTopHelpful) ? 'popular' : 'focus';
  let popular = [] as Array<{ id:string; title:string; excerpt:string; subject:string; helpful:number }>;
  let loadingPopular = false;

  function onSubmit(e: Event) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    goto(`/search?q=${encodeURIComponent(query)}`);
  }

  async function loadPopularIfNeeded() {
    if (mode !== 'popular') return;
    loadingPopular = true;
    popular = await NotesFacade.topHelpful(6);
    loadingPopular = false;
  }

  onMount(loadPopularIfNeeded);

  function onToggle(next: 'focus' | 'popular') {
    mode = next;
    showTopHelpful.set(next === 'popular');
    loadPopularIfNeeded();
  }
</script>

<section class="mx-auto max-w-3xl">
  <!-- Kopfzeile: Toggle links, „Neue Notiz“ rechts -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <h2 class="sr-only">Suche</h2>
      <SegmentedToggle value={mode} onChange={onToggle} />
    </div>

    <a
      href="/note/new"
      aria-label="Neue Notiz erstellen"
      class="grid h-9 w-9 place-items-center rounded-xl border border-black/10 text-black/70 hover:bg-black/[0.04] focus:outline-none focus:ring-4 focus:ring-black/10"
      title="Neue Notiz"
    >
      <!-- Stift/Notiz-Icon -->
      <svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
        <path
          d="M16.862 3.487a2.25 2.25 0 113.182 3.182l-11.31 11.31-4.242 1.06 1.06-4.242 11.31-11.31z"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </a>
  </div>

  <form on:submit={onSubmit} class="relative mt-6">
    <label for="q" class="sr-only">Thema suchen</label>
    <input
      id="q"
      name="q"
      bind:value={q}
      placeholder="Thema, Fach oder Begriff eingeben …"
      autocomplete="off"
      class="w-full rounded-2xl border border-black/10 bg-white px-5 py-4 text-base outline-none focus:border-black/30"
    />
    <div class="mt-2 text-xs text-black/50">Enter zum Suchen.</div>
  </form>
</section>

{#if mode === 'popular'}
  <section class="mx-auto mt-10 max-w-3xl">
    <h3 class="sr-only">Beliebte Notizen</h3>
    {#if loadingPopular}
      <p class="text-sm text-black/50">Lade beliebte Notizen…</p>
    {:else if popular.length === 0}
      <p class="text-sm text-black/50">Noch keine beliebten Notizen.</p>
    {:else}
      <ul class="space-y-4">
        {#each popular as item}
          <li class="rounded-2xl border border-black/5 bg-white p-5 transition-shadow hover:shadow-sm">
            <a href={"/note/" + item.id} class="block">
              <h4 class="text-base font-semibold tracking-tight">{item.title}</h4>
              <p class="mt-2 text-sm leading-relaxed text-black/70">{item.excerpt}</p>
              <div class="mt-3 text-xs text-black/45">{item.subject} · {item.helpful} fanden es hilfreich</div>
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
{/if}