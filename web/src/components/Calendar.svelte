<script>
  import { PERIODS, DAYS } from '../lib/constants.js';
  import { calendarGrid, hasWeekendCourses, currentWeek } from '../lib/stores.js';
  import CalendarCell from './CalendarCell.svelte';

  let visibleDays = $derived($hasWeekendCourses ? DAYS : DAYS.slice(0, 5));
  let visiblePeriods = PERIODS;
</script>

<div
  class="grid gap-px bg-border-light min-w-[700px]"
  style="grid-template-columns: 100px repeat({visibleDays.length}, 1fr);"
>
  <!-- Header row -->
  <div class="bg-white p-2"></div>
  {#each visibleDays as day}
    <div class="bg-white px-2 py-3 text-center font-serif {day.id >= 6 ? 'text-ink-faint' : 'text-ink'}">
      <div class="text-sm font-medium">{day.short}</div>
    </div>
  {/each}

  <!-- Period rows -->
  {#each visiblePeriods as period}
    <!-- Time label -->
    <div class="bg-white px-3 py-2 flex flex-col justify-center border-r border-border-light">
      <div class="text-xs font-medium text-ink-light">P{period.id}</div>
      <div class="text-[10px] text-ink-faint leading-tight mt-0.5">{period.time}</div>
    </div>

    <!-- Day cells -->
    {#each visibleDays as day}
      <CalendarCell
        {day}
        {period}
        entries={$calendarGrid.get(`${day.id}-${period.id}`) || []}
        showWeekBadge={$currentWeek === null}
      />
    {/each}
  {/each}
</div>
