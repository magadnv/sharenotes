<script lang="ts">
  import type { NoteDetail } from '$lib/types/notes';
  import BackButton from '$lib/components/BackButton.svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient';
  import { NotesFacade } from '$lib/facade/notes';
  import { onMount } from 'svelte';

  export let data: { note: NoteDetail | null };

  // Darstellungs-Typen für den gerenderten Inhalt
  type Block =
    | { type: 'text'; value: string }
    | { type: 'image'; url: string }
    | { type: 'pdf'; url: string }
    | { type: 'group'; items: Block[] };

  function parseContent(raw: unknown): Block[] | null {
    try {
      if (typeof raw !== 'string') return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Block[]) : null;
    } catch {
      return null;
    }
  }

  function flatten(b: Block): Block[] {
    return b.type === 'group' ? b.items.flatMap(flatten) : [b];
  }

  const blocks = data.note ? parseContent(data.note.content as unknown as string) : null;

  // Metadaten
  const title = data.note?.title ?? '';
  const subject = data.note?.subject ?? '';
  const createdAt = (data.note as any)?.created_at ?? null;

  // Helpful-Status (reaktiv)
  let helpfulCount =
    data.note
      ? (data.note as any).helpful ?? (data.note as any).helpful_count ?? 0
      : 0;
  let hasMarked = false;
  let helpfulBusy = false;
  let helpfulError = '';

  // Beim Laden prüfen, ob diese Notiz von der aktuellen Nutzer:in bereits gelikt wurde
  onMount(async () => {
    if (!data.note) return;

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: existing, error } = await supabase
      .from('note_helpful')
      .select('id')
      .eq('note_id', data.note.id)
      .eq('user_id', user.id);

    if (!error && (existing ?? []).length > 0) {
      hasMarked = true;
    }
  });

  async function onHelpfulClick() {
    helpfulError = '';
    if (!data.note) return;

    const noteId = data.note.id;

    // Login prüfen
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      goto(`/auth?redirect=/note/${noteId}`);
      return;
    }

    helpfulBusy = true;
    try {
      const { count, active } = await NotesFacade.helpful(noteId);
      helpfulCount = count;
      hasMarked = active;
    } catch (e: any) {
      helpfulError = e?.message ?? 'Konnte Feedback nicht speichern.';
    } finally {
      helpfulBusy = false;
    }
  }
</script>

<div class="mx-auto max-w-3xl space-y-6 px-5 py-6">
  <BackButton label="Zurück zur Suche" />

  {#if !data.note}
    <p class="text-sm text-black/50">Notiz nicht gefunden.</p>
  {:else}
    <article class="mx-auto max-w-2xl">
      <!-- Kopfbereich -->
      <header class="mb-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-xl font-semibold tracking-tight">{title}</h1>
            <div class="mt-1 text-xs text-black/50">
              {#if subject}{subject} · {/if}
              {helpfulCount} fanden es hilfreich
              {#if createdAt} · {new Date(createdAt).toLocaleDateString()}{/if}
            </div>
          </div>

          <button
            class="mt-1 inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-medium transition
                   disabled:opacity-60
                   {hasMarked
                     ? 'border-black bg-black text-white hover:bg-black/90'
                     : 'border-black/10 text-black/80 hover:bg-black/[0.04]'}"
            on:click|preventDefault={onHelpfulClick}
            disabled={helpfulBusy}
          >
            {#if helpfulBusy}
              Wird gespeichert…
            {:else if hasMarked}
              Als hilfreich markiert
            {:else}
              Hilfreich
            {/if}
          </button>
        </div>

        {#if helpfulError}
          <p class="mt-2 text-[11px] text-red-600">{helpfulError}</p>
        {/if}
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
          <p class="leading-7 text-[15px] whitespace-pre-wrap">
            {String(data.note.content ?? '')}
          </p>
        {/if}
      </section>
    </article>
  {/if}
</div>

<style>
  .prose :where(p):not(:where([class~="not-prose"] *)) {
    margin: 0.7rem 0;
  }
</style>