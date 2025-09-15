<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  let email = '';
  let status: 'idle'|'sending'|'sent'|'error' = 'idle';
  let errorMsg = '';

  async function login() {
    status = 'sending';
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) { status = 'error'; errorMsg = error.message; return; }
    status = 'sent';
  }
</script>

<div class="mx-auto max-w-sm space-y-3 px-5 py-8">
  <h1 class="text-base font-semibold tracking-tight">Anmelden</h1>
  <input
    class="w-full border border-black/10 rounded px-3 py-2"
    type="email" placeholder="E-Mail" bind:value={email} />
  <button
    class="w-full rounded bg-black px-3 py-2 text-white disabled:opacity-60"
    on:click|preventDefault={login}
    disabled={status==='sending' || !email}>
    {status==='sending' ? 'Sende Link…' : 'Magic Link senden'}
  </button>
  {#if status==='sent'}
    <p class="text-xs text-black/60">Link gesendet. Prüfe deine Mail.</p>
  {:else if status==='error'}
    <p class="text-xs text-red-600">{errorMsg}</p>
  {/if}
</div>