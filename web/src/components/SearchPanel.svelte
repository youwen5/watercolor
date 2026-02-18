<script>
  import {
    filteredCourses,
    allCourses,
    searchQuery,
    filterDepartment,
    filterCredit,
    filterDay,
    filterPeriod,
    departments,
    selectedIds,
  } from '../lib/stores.js';
  import { DAYS, PERIODS } from '../lib/constants.js';
  import CourseCard from './CourseCard.svelte';

  let panelCollapsed = $state(false);
</script>

{#if panelCollapsed}
  <button
    onclick={() => panelCollapsed = false}
    class="absolute left-0 top-16 z-20 bg-white border border-l-0 border-border rounded-r px-2 py-3 text-ink-light hover:text-ink hover:bg-surface-alt transition-colors cursor-pointer shadow-sm"
    aria-label="Open search panel"
  >
    &rsaquo;
  </button>
{:else}
  <aside class="w-[360px] min-w-[360px] border-r border-border bg-white flex flex-col overflow-hidden">
    <!-- Search header -->
    <div class="p-4 border-b border-border-light">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-serif italic text-lg text-ink">Courses</h2>
        <button
          onclick={() => panelCollapsed = true}
          class="text-ink-faint hover:text-ink-light text-lg leading-none cursor-pointer"
          aria-label="Collapse panel"
        >
          &lsaquo;
        </button>
      </div>

      <input
        type="text"
        placeholder="Search courses..."
        class="w-full px-3 py-2 border border-border rounded text-sm bg-surface placeholder:text-ink-faint focus:outline-none focus:border-ink-faint transition-colors"
        oninput={(e) => searchQuery.set(e.target.value)}
        value={$searchQuery}
      />

      <!-- Filters -->
      <div class="grid grid-cols-2 gap-2 mt-2">
        <select
          class="px-2 py-1.5 border border-border rounded text-xs bg-surface text-ink-light focus:outline-none cursor-pointer"
          onchange={(e) => filterDepartment.set(e.target.value)}
          value={$filterDepartment}
        >
          <option value="">All departments</option>
          {#each $departments as dept}
            <option value={dept}>{dept}</option>
          {/each}
        </select>

        <select
          class="px-2 py-1.5 border border-border rounded text-xs bg-surface text-ink-light focus:outline-none cursor-pointer"
          onchange={(e) => filterCredit.set(e.target.value)}
          value={$filterCredit}
        >
          <option value="">Any credits</option>
          {#each [1,2,3,4,5] as c}
            <option value={c}>{c} credit{c > 1 ? 's' : ''}</option>
          {/each}
        </select>

        <select
          class="px-2 py-1.5 border border-border rounded text-xs bg-surface text-ink-light focus:outline-none cursor-pointer"
          onchange={(e) => filterDay.set(e.target.value)}
          value={$filterDay}
        >
          <option value="">Any day</option>
          {#each DAYS as day}
            <option value={day.id}>{day.name}</option>
          {/each}
        </select>

        <select
          class="px-2 py-1.5 border border-border rounded text-xs bg-surface text-ink-light focus:outline-none cursor-pointer"
          onchange={(e) => filterPeriod.set(e.target.value)}
          value={$filterPeriod}
        >
          <option value="">Any period</option>
          {#each PERIODS as p}
            <option value={p.id}>P{p.id} {p.time}</option>
          {/each}
        </select>
      </div>

      <div class="mt-2 text-xs text-ink-faint">
        Showing {$filteredCourses.length} of {$allCourses.length} courses
      </div>
    </div>

    <!-- Results -->
    <div class="flex-1 overflow-y-auto">
      {#each $filteredCourses as course (course.id)}
        <CourseCard {course} selected={$selectedIds.includes(course.id)} />
      {/each}

      {#if $filteredCourses.length === 0}
        <div class="p-8 text-center text-ink-faint text-sm italic">
          No courses match your search.
        </div>
      {/if}
    </div>
  </aside>
{/if}
