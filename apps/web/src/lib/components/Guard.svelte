<script lang="ts">
  import { sessionStore } from '$lib/auth/session';
  export let redirectTo = '/auth';
  $: session = $sessionStore;
</script>

{#if session?.userId}
  <slot />
{:else}
  <div class="mx-auto max-w-sm px-5 py-6">
    <p class="text-sm">Bitte anmelden, um fortzufahren.</p>
    <a class="text-sm underline" href={redirectTo}>Zur Anmeldung</a>
  </div>
{/if}