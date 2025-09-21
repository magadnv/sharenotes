<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient';

  type Line = {
    id: string;
    active?: boolean;
    showMenu?: boolean;
  };

  let loggedIn = false;
  let saving = false;
  let errorMsg = '';

  // Mindestens eine Zeile
  let lines: Line[] = [{ id: crypto.randomUUID() }];

  // Refs je Zeile
  let editors: Record<string, HTMLDivElement | null> = {};
  let fileInputs: Record<string, HTMLInputElement | null> = {};

  // Client-Guard: nur eingeloggte Nutzer dürfen hier sein
  onMount(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      loggedIn = !!user;
      if (!user) {
        goto('/auth?redirect=/note/new', { replaceState: true });
        return;
      }
    })();

    // Login-Status aktuell halten (falls Session sich ändert)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, session) => {
      loggedIn = !!session?.user;
      if (!loggedIn) goto('/auth?redirect=/note/new', { replaceState: true });
    });

    // Cleanup synchron zurückgeben (kein async-Return!)
    return () => subscription.unsubscribe();
  });

  // Fokus & Menü
  function focusLine(id: string) {
    lines = lines.map(l => ({ ...l, active: l.id === id }));
  }
  function toggleMenu(id: string) {
    lines = lines.map(l => ({ ...l, showMenu: l.id === id ? !l.showMenu : false }));
  }

  // Neue Zeile
  function insertLine(afterId: string) {
    const idx = lines.findIndex(l => l.id === afterId);
    const newLine: Line = { id: crypto.randomUUID() };
    lines = [...lines.slice(0, idx + 1), newLine, ...lines.slice(idx + 1)];
    queueMicrotask(() => {
      editors[newLine.id]?.focus();
      focusLine(newLine.id);
    });
  }

  // Zeile mergen (DOM-basiert)
  function removeLine(id: string) {
    if (lines.length === 1) return;
    const idx = lines.findIndex(l => l.id === id);
    if (idx <= 0) return;
    const prev = lines[idx - 1];
    const cur  = lines[idx];
    const prevEl = editors[prev.id];
    const curEl  = editors[cur.id];
    if (prevEl && curEl) {
      prevEl.append(...Array.from(curEl.childNodes)); // Text/Bilder/PDF-Chips übernehmen
    }
    lines = [...lines.slice(0, idx), ...lines.slice(idx + 1)];
    queueMicrotask(() => {
      if (editors[prev.id]) {
        const r = document.createRange(); const s = window.getSelection();
        r.selectNodeContents(editors[prev.id]!); r.collapse(false);
        s?.removeAllRanges(); s?.addRange(r);
        editors[prev.id]!.focus();
        focusLine(prev.id);
      }
    });
  }

  function onKeyDown(id: string, e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      insertLine(id);
      return;
    }
    if (e.key === 'Backspace') {
      const sel = getSelection();
      if (sel && sel.anchorOffset === 0 && sel.focusOffset === 0) {
        e.preventDefault();
        removeLine(id);
      }
    }
  }

  // Upload (Picker)
  function pickFile(id: string) {
    fileInputs[id]?.click();
  }

  // Datei → Storage hochladen → Inline-Vorschau einsetzen
  async function handlePicked(id: string, e: Event) {
    const input = (e.currentTarget as HTMLInputElement);
    const file = input.files?.[0] ?? null;
    input.value = ''; // reset, damit gleiche Datei erneut geht
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { errorMsg = 'Bitte anmelden, um Dateien hochzuladen.'; return; }

      const url = await uploadToStorage(user.id, file);
      const host = editors[id];
      if (!host) return;

      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = url;
        img.alt = '';
        img.setAttribute('data-asset', 'image');
        img.className = 'inline-block max-h-40 rounded-lg border border-black/10 align-middle';
        const spacerNeeded = !(host.lastChild && host.lastChild.nodeType === Node.TEXT_NODE);
        if (spacerNeeded) host.append(document.createTextNode(' '));
        host.append(img);
      } else {
        // PDF/sonstiges → kleiner Chip-Link
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = 'PDF ansehen';
        a.setAttribute('data-asset', 'pdf');
        a.className = 'inline-flex items-center rounded-md border border-black/10 px-2 py-1 text-[11px] text-black/70 hover:bg-black/[.04] align-middle';
        const spacerNeeded = !(host.lastChild && host.lastChild.nodeType === Node.TEXT_NODE);
        if (spacerNeeded) host.append(document.createTextNode(' '));
        host.append(a);
      }
    } catch (err: any) {
      errorMsg = err?.message ?? 'Upload fehlgeschlagen.';
    }
  }

  async function uploadToStorage(userId: string, file: File) {
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
    const path = `u/${userId}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase
      .storage.from('attachments')
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) throw new Error(upErr.message);
    const { data } = supabase.storage.from('attachments').getPublicUrl(path);
    return data.publicUrl as string;
  }

  // DOM → JSON-Blöcke serialisieren (text | image | pdf)
  function serializeBlocks() {
    const blocks = lines.map((l) => {
      const el = editors[l.id];
      if (!el) return { type: 'text', value: '' };

      const imgs = Array.from(el.querySelectorAll('img[data-asset="image"]')) as HTMLImageElement[];
      const pdfs = Array.from(el.querySelectorAll('a[data-asset="pdf"]')) as HTMLAnchorElement[];
      const text = (el.textContent || '').trim();

      const items: any[] = [];
      if (text) items.push({ type: 'text', value: text });
      imgs.forEach(i => items.push({ type: 'image', url: i.src }));
      pdfs.forEach(a => items.push({ type: 'pdf', url: a.href }));

      if (items.length === 1) return items[0];
      return { type: 'group', items };
    });

    // Titel = erste Text-Komponente
    const first = blocks[0];
    let title = '';
    if (first) {
      if ((first as any).type === 'text') title = (first as any).value || '';
      else if ((first as any).type === 'group') {
        const t = (first as any).items?.find((x: any) => x.type === 'text');
        title = t?.value || '';
      }
    }
    return { title, blocks };
  }

  // Veröffentlichen
  async function share() {
    errorMsg = '';
    if (!loggedIn) { errorMsg = 'Bitte anmelden.'; return; }

    const { title, blocks } = serializeBlocks();
    const content = JSON.stringify(blocks);
    if (!title || !content) {
      errorMsg = 'Bitte Titel (erste Zeile) und Inhalt ergänzen.';
      return;
    }

    saving = true;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { errorMsg = 'Bitte anmelden.'; saving = false; return; }

      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title,
          content,           // JSON als string gespeichert
          is_public: true,
          subject: 'Allgemein'  // falls die Spalte existiert
        })
        .select('id')
        .single();

      if (error) throw new Error(error.message);
      window.location.href = `/note/${data.id}`;
    } catch (e: any) {
      errorMsg = e?.message ?? 'Konnte Notiz nicht veröffentlichen.';
    } finally {
      saving = false;
    }
  }
</script>

<section class="mx-auto max-w-2xl px-8 py-12">
  <!-- Kopf -->
  <div class="flex items-center justify-between">
    <h1 class="text-base font-semibold tracking-tight">Neue Notiz</h1>
    {#if loggedIn}
      <button
        class="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-black/10 disabled:opacity-60"
        on:click|preventDefault={share}
        disabled={saving}
      >
        {saving ? 'Veröffentliche…' : 'Veröffentlichen'}
      </button>
    {:else}
      <a href="/auth?redirect=/note/new" class="text-xs text-black/60 underline underline-offset-2 hover:text-black">Anmelden</a>
    {/if}
  </div>

  <!-- Zeilen-Editor -->
  <div class="mt-8 space-y-3">
    {#each lines as line (line.id)}
      <!-- WICHTIG: items-center sorgt für vertikale Mittigkeit von Icons & Text -->
      <div class="relative group flex items-center gap-2">
        <!-- Plus -->
        <button
          class="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-black/10 text-black/70 transition-opacity
                 opacity-0 group-hover:opacity-100"
          class:opacity-100={line.active}
          on:click|preventDefault={() => toggleMenu(line.id)}
          aria-label="Datei/Bild hinzufügen"
        >
          <svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- Upload-Icon DIREKT neben dem Plus -->
        {#if line.showMenu}
          <button
            class="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-black/10 hover:bg-black/[0.04]"
            on:click|preventDefault={() => pickFile(line.id)}
            aria-label="Bild oder PDF wählen"
            title="Bild/PDF auswählen oder fotografieren"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
              <path d="M8 12l6-6a4 4 0 116 6l-8 8a6 6 0 11-8-8l7-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        {/if}

        <!-- contenteditable Zeile -->
        <div
          class="min-h-[36px] py-1 flex-1 text-sm leading-6 outline-none"
          contenteditable="true"
          bind:this={editors[line.id]}
          on:focus={() => focusLine(line.id)}
          on:keydown={(e) => onKeyDown(line.id, e)}
          data-placeholder={line === lines[0] ? 'Titel' : 'Was hast du gelernt?'}
        ></div>

        <!-- Versteckter File-Input pro Zeile -->
        <input
          class="sr-only"
          type="file"
          bind:this={fileInputs[line.id]}
          accept="image/*,application/pdf"
          capture="environment"
          on:change={(e) => handlePicked(line.id, e)}
        />
      </div>
    {/each}
  </div>

  {#if errorMsg}
    <p class="mt-4 text-xs text-red-600">{errorMsg}</p>
  {/if}
</section>

<style>
  [contenteditable][data-placeholder]:empty::before {
    content: attr(data-placeholder);
    color: rgba(0,0,0,.4);
  }
  [contenteditable] { outline: none; }
  img[data-asset="image"] { display:inline-block; vertical-align:middle; }
</style>