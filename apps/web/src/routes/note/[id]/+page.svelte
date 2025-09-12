<script lang="ts">
  import type { NoteDetail } from '$lib/types/notes';
  import BackButton from '$lib/components/BackButton.svelte';
  export let data: { note: NoteDetail | null };
</script>
<div class="mx-auto max-w-3xl space-y-6">
  <BackButton label="Zurück zur Suche" />
    {#if !data.note}
    <p class="text-sm text-black/50">Notiz nicht gefunden.</p>
    {:else}
    <article class="mx-auto max-w-3xl">
        <h1 class="text-xl font-semibold tracking-tight">{data.note.title}</h1>
        <div class="mt-2 text-xs text-black/45">{data.note.subject} · {data.note.helpful} fanden es hilfreich</div>
        <div class="prose mt-6 text-black/80">
        {data.note.content}
        </div>
    </article>
    {/if}
</div>