<script lang="ts">
  import type { NoteDetail } from '$lib/types/notes';
  import BackButton from '$lib/components/BackButton.svelte';

  export let data: { note: NoteDetail | null };

  // Darstellungs-Typen für den gerenderten Inhalt
  type Block =
    | { type: 'text'; value: string }
    | { type: 'image'; url: string }
    | { type: 'pdf'; url: string }
    | { type: 'group'; items: Block[] };

  // JSON sicher parsen; bei Fehler -> null (wir rendern dann Plaintext)
  function parseContent(raw: unknown): Block[] | null {
    try {
      if (typeof raw !== 'string') return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Block[]) : null;
    } catch {
      return null;
    }
  }

  // Gruppen flach ziehen, damit wir gleichmäßig rendern können
  function flatten(b: Block): Block[] {
    return b.type === 'group' ? b.items.flatMap(flatten) : [b];
  }

  const blocks = data.note ? parseContent(data.note.content as unknown as string) : null;

  // Metadaten
  const title = data.note?.title ?? '';
  const subject = data.note?.subject ?? '';
  const helpful = (data.note as any)?.helpful ?? (data.note as any)?.helpful_count ?? 0;
  const createdAt = (data.note as any)?.created_at ?? null;
</script>

<div class="mx-auto max-w-3xl space-y-6 px-5 py-6">
  <BackButton label="Zurück zur Suche" />

  {#if !data.note}
    <p class="text-sm text-black/50">Notiz nicht gefunden.</p>
  {:else}
    <article class="mx-auto max-w-2xl">
      <!-- Kopfbereich -->
      <header class="mb-4">
        <h1 class="text-xl font-semibold tracking-tight">{title}</h1>
        <div class="mt-1 text-xs text-black/50">
          {#if subject}{subject} · {/if}
          {helpful} fanden es hilfreich
          {#if createdAt} · {new Date(createdAt).toLocaleDateString()}{/if}
        </div>
      </header>

      <!-- Inhalt -->
      <section class="prose prose-neutral max-w-none">
        {#if blocks}
          {#each blocks as b}
            {#each flatten(b) as atom}
              {#if atom.type === 'text'}
                <p class="leading-7 text-[15px]">{atom.value}</p>
              {:else if atom.type === 'image'}
                <figure class="my-4">
                  <img
                    src={atom.url}
                    alt=""
                    loading="lazy"
                    class="rounded-xl border border-black/10 max-h-[460px] w-auto"
                  />
                </figure>
              {:else if atom.type === 'pdf'}
                <p class="my-2 not-prose">
                  <a
                    href={atom.url}
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center rounded-lg border border-black/10 px-3 py-1.5 text-sm hover:bg-black/[0.04]"
                  >
                    PDF ansehen
                  </a>
                </p>
              {/if}
            {/each}
          {/each}
        {:else}
          <!-- Fallback: alter Content als Plaintext -->
          <p class="leading-7 text-[15px] whitespace-pre-wrap">{String(data.note.content ?? '')}</p>
        {/if}
      </section>
    </article>
  {/if}
</div>

<style>
  /* Etwas ruhigere Abstände als die Standard-typography */
  .prose :where(p):not(:where([class~="not-prose"] *)) {
    margin: 0.7rem 0;
  }
</style>