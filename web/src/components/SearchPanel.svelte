<script>
  import {
    filteredCourses,
    selectedIds,
  } from '../lib/stores.js';
  import CourseCard from './CourseCard.svelte';

  let { mobile = false } = $props();
  let panelCollapsed = $state(false);
</script>

<!-- Desktop: collapsible sidebar -->
{#if !mobile && panelCollapsed}
  <button
    onclick={() => panelCollapsed = false}
    class="absolute left-0 top-16 z-20 bg-white border border-l-0 border-border rounded-r px-2 py-3 text-ink-light hover:text-ink hover:bg-surface-alt transition-colors cursor-pointer shadow-sm"
    aria-label="Open search panel"
  >
    &rsaquo;
  </button>
{:else}
  <aside class="{mobile
    ? 'flex flex-col overflow-hidden flex-1'
    : 'w-[340px] min-w-[340px] border-r border-border bg-white flex flex-col overflow-hidden'}">

    <!-- Sidebar header -->
    <div class="shrink-0 px-4 py-2.5 border-b border-border-light flex items-center justify-between">
      <div>
        <h2 class="font-serif italic text-base text-ink">Courses</h2>
        <p class="text-[11px] text-ink-faint mt-0.5">
          {$filteredCourses.length} results
        </p>
      </div>
      {#if !mobile}
        <button
          onclick={() => panelCollapsed = true}
          class="text-ink-faint hover:text-ink-light text-lg leading-none cursor-pointer"
          aria-label="Collapse panel"
        >
          &lsaquo;
        </button>
      {/if}
    </div>

    <!-- Results (scrolls independently) -->
    <div class="flex-1 overflow-y-auto">
      {#each $filteredCourses as course (course.id)}
        <CourseCard {course} selected={$selectedIds.includes(course.id)} />
      {/each}

      {#if $filteredCourses.length === 0}
        <div class="p-8 text-center text-ink-faint text-sm italic">
          No courses match your filters.
        </div>
      {/if}
    </div>
  </aside>
{/if}
