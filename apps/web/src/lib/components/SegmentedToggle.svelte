<script lang="ts">
  export let value: 'focus' | 'popular' = 'focus';
  export let onChange: (v: 'focus' | 'popular') => void = () => {};
</script>

<div class="inline-flex rounded-2xl border border-black/10 bg-white p-1 text-sm">
  <button
    type="button"
    class="rounded-xl px-3 py-1.5 transition
           {value === 'focus' ? 'bg-black text-white' : 'text-black/60 hover:text-black'}"
    aria-pressed={value === 'focus'}
    on:click={() => onChange('focus')}
  >
    Fokus
  </button>
  <button
    type="button"
    class="rounded-xl px-3 py-1.5 transition
           {value === 'popular' ? 'bg-black text-white' : 'text-black/60 hover:text-black'}"
    aria-pressed={value === 'popular'}
    on:click={() => onChange('popular')}
  >
    Beliebte Notizen
  </button>
</div>