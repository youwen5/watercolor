<script>
  import CourseBlock from './CourseBlock.svelte';
  import CustomBlock from './CustomBlock.svelte';
  import { pendingCustomSlot } from './AddCustomItemModal.svelte';

  let { day, period, entries, showWeekBadge = false } = $props();

  let isConflict = $derived(entries.filter(e => e.course).length > 1);

  function handleCellClick(e) {
    if (e.target === e.currentTarget) {
      pendingCustomSlot.set({ day: day.id, period: period.id });
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div
  class="bg-white min-h-[80px] p-1 relative transition-colors cursor-pointer
    {isConflict ? 'ring-2 ring-conflict/40 ring-inset' : ''}
    {day.id >= 6 ? 'bg-surface/50' : ''}"
  onclick={handleCellClick}
>
  {#if isConflict}
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none"
      style="background: repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 4px,
        #dc2626 4px,
        #dc2626 5px
      )">
    </div>
  {/if}

  <div class="relative flex flex-col gap-0.5">
    {#each entries as entry}
      {#if entry.course}
        <CourseBlock course={entry.course} slot={entry.slot} {showWeekBadge} />
      {:else if entry.custom}
        <CustomBlock item={entry.custom} {showWeekBadge} />
      {/if}
    {/each}
  </div>
</div>
