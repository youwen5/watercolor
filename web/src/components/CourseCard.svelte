<script>
  import { selectedIds, selectedCourses } from '../lib/stores.js';
  import { formatTimeSlots } from '../lib/parser.js';
  import { findConflicts } from '../lib/conflicts.js';
  import { pendingConflict } from './ConflictModal.svelte';
  import { get } from 'svelte/store';

  let { course, selected = false } = $props();

  function addCourse() {
    if (selected) return;

    const currentSelected = get(selectedCourses);
    const conflicts = findConflicts(currentSelected, course);

    if (conflicts.length > 0) {
      pendingConflict.set({ course, conflicts });
    } else {
      selectedIds.add(course.id);
    }
  }

  function removeCourse() {
    selectedIds.remove(course.id);
  }
</script>

<div class="px-4 py-3 border-b border-border-light hover:bg-surface-alt/50 transition-colors">
  <div class="flex items-start justify-between gap-2">
    <div class="flex-1 min-w-0">
      <div class="text-sm font-medium text-ink leading-snug truncate">{course.title_en}</div>
      <div class="text-xs text-ink-light mt-0.5 truncate">{course.title_zh}</div>
    </div>

    {#if selected}
      <button
        onclick={removeCourse}
        class="shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-conflict/30 text-conflict text-sm hover:bg-conflict/5 transition-colors cursor-pointer"
        aria-label="Remove {course.title_en}"
      >
        &minus;
      </button>
    {:else}
      <button
        onclick={addCourse}
        class="shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-border text-ink-light text-sm hover:border-ink-light hover:text-ink transition-colors cursor-pointer"
        aria-label="Add {course.title_en}"
      >
        +
      </button>
    {/if}
  </div>

  <div class="flex items-center gap-2 mt-1.5 text-[11px] text-ink-faint">
    <span class="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-alt font-medium text-ink-light">
      {course.credit} cr
    </span>
    <span class="truncate">{course.department}</span>
  </div>

  <div class="flex items-center gap-2 mt-1 text-[11px] text-ink-faint">
    <span>{course.instructor}</span>
    <span class="text-border">|</span>
    <span class="truncate">
      {#if course.schedulable}
        {formatTimeSlots(course.slots)}
      {:else}
        <span class="italic">Time TBD</span>
      {/if}
    </span>
  </div>
</div>
