<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
</script>

<div class="min-h-screen bg-white text-black antialiased">
  <Header title="ShareNotes" subtitle="Suche. Finde. Lerne." />
  <main class="mx-auto max-w-3xl px-5 py-10">
    <slot />
  </main>
</div>