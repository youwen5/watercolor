<script>
  import MultiSelect from 'svelte-multiselect';
  import {
    filteredCourses,
    allCourses,
    searchQuery,
    filterDepartments,
    filterCreditMin,
    filterCreditMax,
    filterDay,
    filterPeriod,
    departments,
    selectedIds,
  } from '../lib/stores.js';
  import { DAYS, PERIODS } from '../lib/constants.js';
  import CourseCard from './CourseCard.svelte';

  let { mobile = false } = $props();
  let panelCollapsed = $state(false);
  let deptSelection = $state([]);

  function handleDeptChange() {
    filterDepartments.set(deptSelection);
  }

  function clearFilters() {
    searchQuery.set('');
    deptSelection = [];
    filterDepartments.set([]);
    filterCreditMin.set('');
    filterCreditMax.set('');
    filterDay.set('');
    filterPeriod.set('');
  }

  let hasActiveFilters = $derived(
    $searchQuery || $filterDepartments.length > 0 || $filterCreditMin || $filterCreditMax || $filterDay || $filterPeriod
  );
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
    : 'w-[380px] min-w-[380px] border-r border-border bg-white flex flex-col overflow-hidden'}">

    <!-- Introduction -->
    <div class="shrink-0 px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 border-b border-border-light">
      <p class="text-xs text-ink-light leading-relaxed">
        Watercolor is an unofficial course planner for Tsinghua University's Spring 2026 Semester.
        Created by <a href="https://web.youwen.dev" target="_blank" rel="noreferrer" class="underline underline-offset-2 hover:text-ink transition-colors">Youwen Wu</a>.
        <a href="https://github.com/youwen5/watercolor" target="_blank" rel="noreferrer" class="underline underline-offset-2 hover:text-ink transition-colors">Open source</a>.
      </p>
    </div>

    <!-- Search header (fixed, never scrolls) -->
    <div class="shrink-0 p-3 sm:p-4 border-b border-border-light">
      <div class="flex items-center justify-between mb-2 sm:mb-3">
        <h2 class="font-serif italic text-lg text-ink">Courses</h2>
        <div class="flex items-center gap-2">
          {#if hasActiveFilters}
            <button
              onclick={clearFilters}
              class="text-xs text-ink-faint hover:text-ink-light transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          {/if}
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
      </div>

      <input
        type="text"
        placeholder="Search by name, instructor, or number..."
        class="w-full px-3 py-2 border border-border rounded text-sm bg-surface placeholder:text-ink-faint focus:outline-none focus:border-ink-faint transition-colors"
        oninput={(e) => searchQuery.set(e.target.value)}
        value={$searchQuery}
      />

      <!-- Department multi-select -->
      <div class="mt-2 sm:mt-3">
        <span class="text-[11px] font-medium text-ink-faint uppercase tracking-wider">Department</span>
        <div class="mt-1 dept-select">
          <MultiSelect
            bind:selected={deptSelection}
            options={$departments}
            placeholder="All departments"
            on:change={handleDeptChange}
            on:remove={handleDeptChange}
            on:removeAll={() => { deptSelection = []; filterDepartments.set([]); }}
            --sms-border="1px solid var(--color-border)"
            --sms-border-radius="0.375rem"
            --sms-font-size="0.75rem"
            --sms-padding="0.25rem 0.5rem"
            --sms-bg="var(--color-surface)"
            --sms-text-color="var(--color-ink-light)"
            --sms-placeholder-color="var(--color-ink-faint)"
            --sms-open-border-color="var(--color-ink-faint)"
            --sms-selected-bg="var(--color-surface-alt)"
            --sms-selected-text-color="var(--color-ink)"
            --sms-li-selected-bg="var(--color-surface-alt)"
            --sms-li-active-bg="var(--color-surface-hover)"
            --sms-options-bg="white"
            --sms-max-height="14rem"
          />
        </div>
      </div>

      <!-- Credit range + day + period -->
      <div class="mt-2 sm:mt-3 space-y-2">
        <div>
          <span class="text-[11px] font-medium text-ink-faint uppercase tracking-wider">Credits</span>
          <div class="flex items-center gap-2 mt-1">
            <select
              class="flex-1 px-2 py-1.5 border border-border rounded text-xs bg-surface text-ink-light focus:outline-none cursor-pointer"
              onchange={(e) => filterCreditMin.set(e.target.value)}
              value={$filterCreditMin}
            >
              <option value="">Min</option>
              {#each [1,2,3,4,5] as c}
                <option value={c}>{c}</option>
              {/each}
            </select>
            <span class="text-ink-faint text-xs">&ndash;</span>
            <select
              class="flex-1 px-2 py-1.5 border border-border rounded text-xs bg-surface text-ink-light focus:outline-none cursor-pointer"
              onchange={(e) => filterCreditMax.set(e.target.value)}
              value={$filterCreditMax}
            >
              <option value="">Max</option>
              {#each [1,2,3,4,5] as c}
                <option value={c}>{c}</option>
              {/each}
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <span class="text-[11px] font-medium text-ink-faint uppercase tracking-wider">Day</span>
            <select
              class="mt-1 w-full px-2 py-1.5 border border-border rounded text-xs bg-surface text-ink-light focus:outline-none cursor-pointer"
              onchange={(e) => filterDay.set(e.target.value)}
              value={$filterDay}
            >
              <option value="">Any day</option>
              {#each DAYS as day}
                <option value={day.id}>{day.name}</option>
              {/each}
            </select>
          </div>

          <div>
            <span class="text-[11px] font-medium text-ink-faint uppercase tracking-wider">Period</span>
            <select
              class="mt-1 w-full px-2 py-1.5 border border-border rounded text-xs bg-surface text-ink-light focus:outline-none cursor-pointer"
              onchange={(e) => filterPeriod.set(e.target.value)}
              value={$filterPeriod}
            >
              <option value="">Any period</option>
              {#each PERIODS as p}
                <option value={p.id}>P{p.id} {p.time}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>

      <div class="mt-2 text-xs text-ink-faint">
        Showing <span class="font-medium text-ink-light">{$filteredCourses.length}</span> of {$allCourses.length} courses
      </div>
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
