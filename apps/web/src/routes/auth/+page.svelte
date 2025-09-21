<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient';

  let email = '';
  let status: 'idle' | 'sending' | 'sent' | 'error' = 'idle';
  let errorMsg = '';

  const getBackTarget = () =>
    new URLSearchParams(window.location.search).get('redirect') || '/';

  async function login() {
    status = 'sending';
    const origin = window.location.origin; // z. B. http://localhost:5173
    const redirectTo = `${origin}/auth?redirect=${encodeURIComponent(getBackTarget())}`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true
      }
    });

    if (error) { status = 'error'; errorMsg = error.message; return; }
    status = 'sent';
  }

  onMount(() => {
    const back = getBackTarget();

    // 1) Fehler aus Hash (z. B. otp_expired) anzeigen und Hash bereinigen
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const err = hash.get('error') || hash.get('error_code');
    const desc = hash.get('error_description');
    if (err) {
      status = 'error';
      errorMsg = desc || 'Anmeldelink ist ungültig oder abgelaufen.';
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // 2) Code → Session tauschen (erforderlich für Magic-Link/GoTrue v2)
    (async () => {
      try {
        await supabase.auth.exchangeCodeForSession(window.location.href);
      } catch {
        // Kein Code vorhanden oder bereits eingelöst – ignorieren
      }

      // 3) Sofortige Session-Prüfung
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        goto(back, { replaceState: true });
        return;
      }
    })();

    // 4) Event-Listener als Fallback, falls Session minimal verzögert gesetzt wird
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, s) => {
      if (s?.user) goto(back, { replaceState: true });
    });

    // Cleanup synchron zurückgeben (wichtig für TS)
    return () => {
      subscription.unsubscribe();
    };
  });
</script>

<div class="mx-auto max-w-sm space-y-3 px-5 py-8">
  <h1 class="text-base font-semibold tracking-tight">Anmelden</h1>

  <input
    class="w-full rounded border border-black/10 px-3 py-2"
    type="email"
    placeholder="E-Mail"
    bind:value={email}
    autocomplete="email"
  />

  <button
    class="w-full rounded bg-black px-3 py-2 text-white disabled:opacity-60 hover:opacity-90"
    on:click|preventDefault={login}
    disabled={status === 'sending' || !email}
  >
    {status === 'sending' ? 'Sende Link…' : 'Magic Link senden'}
  </button>

  {#if status === 'sent'}
    <p class="text-xs text-black/60">Link gesendet. Bitte E-Mail öffnen und anklicken.</p>
  {:else if status === 'error'}
    <p class="text-xs text-red-600">{errorMsg}</p>
  {/if}
</div>