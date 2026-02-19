<script module>
  import { writable } from 'svelte/store';
  // { day: number, period: number } or null
  export const pendingCustomSlot = writable(null);
</script>

<script>
  import { customItems } from '../lib/stores.js';
  import { DAYS, PERIODS, MAX_WEEK } from '../lib/constants.js';

  let title = $state('');
  let selectedWeeks = $state(new Set(Array.from({ length: MAX_WEEK }, (_, i) => i + 1)));

  function close() {
    pendingCustomSlot.set(null);
    title = '';
    selectedWeeks = new Set(Array.from({ length: MAX_WEEK }, (_, i) => i + 1));
  }

  function submit() {
    if (!title.trim() || !$pendingCustomSlot) return;
    customItems.add({
      title: title.trim(),
      day: $pendingCustomSlot.day,
      period: $pendingCustomSlot.period,
      weeks: new Set(selectedWeeks),
      color: '#78716c',
    });
    close();
  }

  function toggleWeek(w) {
    selectedWeeks = new Set(selectedWeeks);
    if (selectedWeeks.has(w)) {
      selectedWeeks.delete(w);
    } else {
      selectedWeeks.add(w);
    }
  }

  function selectAll() {
    selectedWeeks = new Set(Array.from({ length: MAX_WEEK }, (_, i) => i + 1));
  }

  function selectNone() {
    selectedWeeks = new Set();
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') close();
  }

  function dayName(id) {
    return DAYS.find(d => d.id === id)?.short || `Day ${id}`;
  }

  function periodName(id) {
    const p = PERIODS.find(p => p.id === id);
    return p ? `P${p.id} (${p.time})` : `P${id}`;
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if $pendingCustomSlot}
  <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-ink/20 backdrop-blur-sm" onclick={close}></div>

    <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
      <h3 class="font-serif italic text-xl text-ink mb-1">Add Custom Item</h3>
      <p class="text-sm text-ink-light mb-4">
        {dayName($pendingCustomSlot.day)} &middot; {periodName($pendingCustomSlot.period)}
      </p>

      <label for="custom-item-title" class="block text-sm text-ink-faint mb-1">Title</label>
      <input
        id="custom-item-title"
        type="text"
        bind:value={title}
        placeholder="e.g. Study session, Lunch..."
        class="w-full border border-border rounded px-3 py-2 text-sm text-ink placeholder:text-ink-faint/50 focus:outline-none focus:ring-1 focus:ring-ink/30 mb-4"
        onkeydown={(e) => { if (e.key === 'Enter') submit(); }}
      />

      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-ink-faint">Weeks</span>
        <div class="flex gap-2 text-xs">
          <button onclick={selectAll} class="text-ink-light hover:text-ink cursor-pointer">All</button>
          <button onclick={selectNone} class="text-ink-light hover:text-ink cursor-pointer">None</button>
        </div>
      </div>
      <div class="flex flex-wrap gap-1 mb-6">
        {#each Array.from({ length: MAX_WEEK }, (_, i) => i + 1) as w}
          <button
            onclick={() => toggleWeek(w)}
            class="w-8 h-8 rounded text-xs cursor-pointer transition-colors
              {selectedWeeks.has(w)
                ? 'bg-ink text-white'
                : 'bg-surface text-ink-light hover:bg-surface-alt'}"
          >
            {w}
          </button>
        {/each}
      </div>

      <div class="flex justify-end gap-3">
        <button
          onclick={close}
          class="px-4 py-2 text-sm border border-border rounded hover:bg-surface-alt transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onclick={submit}
          disabled={!title.trim() || selectedWeeks.size === 0}
          class="px-4 py-2 text-sm bg-ink text-white rounded hover:bg-ink/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </div>
  </div>
{/if}
