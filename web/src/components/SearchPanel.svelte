<script>
  import {
    filteredCourses,
    allCourses,
    searchQuery,
    filterDepartments,
    filterCreditMin,
    filterCreditMax,
    filterDays,
    filterPeriods,
    departments,
    selectedIds,
  } from '../lib/stores.js';
  import { DAYS, PERIODS } from '../lib/constants.js';
  import CourseCard from './CourseCard.svelte';
  import MultiSelect from './MultiSelect.svelte';

  let { mobile = false } = $props();
  let panelCollapsed = $state(false);

  let selectedDepts = $state([]);
  let selectedDays = $state([]);
  let selectedPeriods = $state([]);

  const dayOptions = DAYS.map(d => ({ value: d.id, label: d.name }));
  const periodOptions = PERIODS.map(p => ({ value: p.id, label: `P${p.id} ${p.time}` }));

  let deptOptions = $derived(
    $departments.map(d => ({ value: d, label: d }))
  );

  function clearFilters() {
    searchQuery.set('');
    selectedDepts = [];
    selectedDays = [];
    selectedPeriods = [];
    filterDepartments.set([]);
    filterDays.set([]);
    filterPeriods.set([]);
    filterCreditMin.set('');
    filterCreditMax.set('');
  }

  let hasActiveFilters = $derived(
    $searchQuery || $filterDepartments.length > 0 || $filterCreditMin || $filterCreditMax || $filterDays.length > 0 || $filterPeriods.length > 0
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
        <div class="mt-1">
          <MultiSelect
            options={deptOptions}
            bind:selected={selectedDepts}
            onchange={(v) => filterDepartments.set(v)}
            placeholder="All departments"
            searchable={true}
          />
        </div>
      </div>

      <!-- Credit range -->
      <div class="mt-2 sm:mt-3">
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

      <!-- Day + Period multi-selects -->
      <div class="mt-2 sm:mt-3 grid grid-cols-2 gap-2">
        <div>
          <span class="text-[11px] font-medium text-ink-faint uppercase tracking-wider">Day</span>
          <div class="mt-1">
            <MultiSelect
              options={dayOptions}
              bind:selected={selectedDays}
              onchange={(v) => filterDays.set(v)}
              placeholder="Any day"
            />
          </div>
        </div>

        <div>
          <span class="text-[11px] font-medium text-ink-faint uppercase tracking-wider">Period</span>
          <div class="mt-1">
            <MultiSelect
              options={periodOptions}
              bind:selected={selectedPeriods}
              onchange={(v) => filterPeriods.set(v)}
              placeholder="Any period"
            />
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
