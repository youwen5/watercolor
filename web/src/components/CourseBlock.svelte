<script>
  import { selectedIds } from '../lib/stores.js';
  import { formatWeeks } from '../lib/parser.js';
  import { detailCourse } from './CourseDetail.svelte';

  let { course, slot, showWeekBadge = false } = $props();

  function remove(e) {
    e.stopPropagation();
    selectedIds.remove(course.id);
  }

  function showDetail() {
    detailCourse.set(course);
  }
</script>

<div
  class="group rounded px-2 py-1.5 text-white text-[11px] leading-tight cursor-pointer relative overflow-hidden transition-shadow hover:shadow-md"
  style="background-color: {course.color};"
  onclick={showDetail}
  onkeydown={(e) => { if (e.key === 'Enter') showDetail(); }}
  role="button"
  tabindex="0"
  title="{course.title_en}\n{course.title_zh}\n{course.instructor}"
>
  <button
    onclick={remove}
    class="absolute top-0.5 right-1 opacity-0 group-hover:opacity-80 text-white/80 hover:text-white text-sm leading-none cursor-pointer"
    aria-label="Remove {course.title_en}"
  >
    &times;
  </button>

  <div class="font-medium truncate pr-3">{course.title_en}</div>
  <div class="truncate opacity-80">{course.title_zh}</div>
  <div class="truncate opacity-70 mt-0.5">{course.instructor}</div>

  {#if showWeekBadge}
    <div class="mt-0.5 text-[9px] opacity-60 truncate">
      {formatWeeks(slot.weeks)}
    </div>
  {/if}
</div>
