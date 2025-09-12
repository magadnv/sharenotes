<script lang="ts">
  import BackButton from '$lib/components/BackButton.svelte';
  export let data: { q: string; results: Array<{ id:string; title:string; excerpt:string; subject:string; helpful:number }> };
  let q = data.q;
</script>

<div class="mx-auto max-w-3s space-y-6">
    <BackButton label="Zur Startseite" />

    <div class="mx-auto max-w-3xl">
    <form method="GET" action="/search" class="relative">
        <input
        name="q"
        bind:value={q}
        placeholder="Thema, Fach oder Begriff eingeben …"
        class="w-full rounded-2xl border border-black/10 bg-white px-5 py-4 text-base outline-none focus:border-black/30"
        />
        <div class="mt-2 text-xs text-black/50">Enter zum Suchen.</div>
    </form>

    {#if !q}
        <p class="mt-10 text-sm text-black/50">Gib einen Begriff ein, z. B. „Dijkstra“.</p>
    {:else if data.results.length === 0}
        <p class="mt-10 text-sm text-black/50">Keine Treffer für „{q}“. Versuche es allgemeiner.</p>
    {:else}
        <ul class="mt-8 space-y-4">
        {#each data.results as item}
            <li class="rounded-2xl border border-black/5 bg-white p-5 transition-shadow hover:shadow-sm">
            <a href={"/note/" + item.id} class="block">
                <h3 class="text-base font-semibold tracking-tight">{item.title}</h3>
                <p class="mt-2 text-sm leading-relaxed text-black/70">{item.excerpt}</p>
                <div class="mt-3 text-xs text-black/45">{item.subject} · {item.helpful} fanden es hilfreich</div>
            </a>
            </li>
        {/each}
        </ul>
    {/if}
    </div>
</div>