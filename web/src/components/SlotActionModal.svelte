<script module>
  import { writable } from 'svelte/store';
  // { day: number, period: number } or null
  export const pendingSlotAction = writable(null);
</script>

<script>
  import { pendingCustomSlot } from './AddCustomItemModal.svelte';
  import { filterDays, filterPeriods, mobileView } from '../lib/stores.js';
  import { DAYS, PERIODS } from '../lib/constants.js';

  function close() {
    pendingSlotAction.set(null);
  }

  function addCustomItem() {
    const slot = $pendingSlotAction;
    close();
    pendingCustomSlot.set(slot);
  }

  function searchCourses() {
    const slot = $pendingSlotAction;
    close();
    filterDays.set([slot.day]);
    filterPeriods.set([slot.period]);
    mobileView.set('search');
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

{#if $pendingSlotAction}
  <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-ink/20 backdrop-blur-sm" onclick={close}></div>

    <div class="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
      <h3 class="font-serif italic text-xl text-ink mb-1">
        {dayName($pendingSlotAction.day)} &middot; {periodName($pendingSlotAction.period)}
      </h3>
      <p class="text-sm text-ink-light mb-5">What would you like to do?</p>

      <div class="flex flex-col gap-2">
        <button
          onclick={searchCourses}
          class="w-full px-4 py-3 text-sm text-left border border-border rounded-lg hover:bg-surface-alt transition-colors cursor-pointer group"
        >
          <span class="font-medium text-ink">Search courses</span>
          <span class="block text-xs text-ink-faint mt-0.5">Find courses that meet during this time slot</span>
        </button>
        <button
          onclick={addCustomItem}
          class="w-full px-4 py-3 text-sm text-left border border-border rounded-lg hover:bg-surface-alt transition-colors cursor-pointer group"
        >
          <span class="font-medium text-ink">Add custom item</span>
          <span class="block text-xs text-ink-faint mt-0.5">Block off this slot with a custom label</span>
        </button>
      </div>

      <button
        onclick={close}
        class="mt-4 w-full py-2 text-xs text-ink-faint hover:text-ink-light transition-colors cursor-pointer"
      >
        Cancel
      </button>
    </div>
  </div>
{/if}
