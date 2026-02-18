<script module>
  import { writable } from 'svelte/store';
  // { course, conflicts } or null
  export const pendingConflict = writable(null);
</script>

<script>
  import { selectedIds } from '../lib/stores.js';
  import { DAYS, PERIODS } from '../lib/constants.js';
  import { formatWeeks } from '../lib/parser.js';

  function close() {
    pendingConflict.set(null);
  }

  function addAnyway() {
    if ($pendingConflict) {
      selectedIds.add($pendingConflict.course.id);
    }
    close();
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

{#if $pendingConflict}
  <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-ink/20 backdrop-blur-sm" onclick={close}></div>

    <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
      <h3 class="font-serif italic text-xl text-ink mb-1">Schedule Conflict</h3>
      <p class="text-sm text-ink-light mb-4">
        <span class="font-medium text-ink">{$pendingConflict.course.title_en}</span>
        conflicts with existing courses:
      </p>

      <div class="space-y-3 mb-6">
        {#each $pendingConflict.conflicts as conflict}
          <div class="border border-conflict/20 rounded p-3 bg-conflict/[0.02]">
            <div class="text-sm font-medium text-ink">{conflict.existing.title_en}</div>
            <div class="text-xs text-ink-light mt-1">
              {dayName(conflict.day)} {periodName(conflict.period)}
            </div>
            <div class="text-xs text-ink-faint mt-0.5">
              Overlapping: {formatWeeks(conflict.overlappingWeeks)}
            </div>
          </div>
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
          onclick={addAnyway}
          class="px-4 py-2 text-sm bg-ink text-white rounded hover:bg-ink/90 transition-colors cursor-pointer"
        >
          Add anyway
        </button>
      </div>
    </div>
  </div>
{/if}
