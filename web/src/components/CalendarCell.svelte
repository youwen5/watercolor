<script>
  import CourseBlock from './CourseBlock.svelte';

  let { day, period, entries, showWeekBadge = false } = $props();

  let isConflict = $derived(entries.length > 1);
</script>

<div
  class="bg-white min-h-[80px] p-1 relative transition-colors
    {isConflict ? 'ring-2 ring-conflict/40 ring-inset' : ''}
    {day.id >= 6 ? 'bg-surface/50' : ''}"
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
    {#each entries as { course, slot }}
      <CourseBlock {course} {slot} {showWeekBadge} />
    {/each}
  </div>
</div>
