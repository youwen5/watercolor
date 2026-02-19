<script>
  import {
    allCourses,
    filteredCourses,
    searchQuery,
    filterDepartments,
    filterCreditMin,
    filterCreditMax,
    filterDays,
    filterPeriods,
    departments,
  } from '../lib/stores.js';
  import { DAYS, PERIODS } from '../lib/constants.js';
  import MultiSelect from './MultiSelect.svelte';

  let selectedDepts = $state([]);
  let selectedDays = $state([]);
  let selectedPeriods = $state([]);

  const dayOptions = DAYS.map(d => ({ value: d.id, label: d.short }));
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

<div class="shrink-0 border-b border-border bg-white px-4 py-2">
  <div class="flex flex-wrap items-end gap-x-3 gap-y-2">
    <!-- Search -->
    <div class="flex-1 min-w-[180px]">
      <span class="text-[10px] font-medium text-ink-faint uppercase tracking-wider">Search</span>
      <input
        type="text"
        placeholder="Name, instructor, or number..."
        class="mt-0.5 w-full px-2.5 py-1.5 border border-border rounded text-xs bg-surface placeholder:text-ink-faint focus:outline-none focus:border-ink-faint transition-colors"
        oninput={(e) => searchQuery.set(e.target.value)}
        value={$searchQuery}
      />
    </div>

    <!-- Department -->
    <div class="w-[200px]">
      <span class="text-[10px] font-medium text-ink-faint uppercase tracking-wider">Department</span>
      <div class="mt-0.5">
        <MultiSelect
          options={deptOptions}
          bind:selected={selectedDepts}
          onchange={(v) => filterDepartments.set(v)}
          placeholder="All"
          searchable={true}
        />
      </div>
    </div>

    <!-- Credits -->
    <div class="w-[130px]">
      <span class="text-[10px] font-medium text-ink-faint uppercase tracking-wider">Credits</span>
      <div class="flex items-center gap-1 mt-0.5">
        <select
          class="flex-1 min-w-0 px-1.5 py-1.5 border border-border rounded text-xs bg-surface text-ink-light focus:outline-none cursor-pointer"
          onchange={(e) => filterCreditMin.set(e.target.value)}
          value={$filterCreditMin}
        >
          <option value="">Min</option>
          {#each [1,2,3,4,5] as c}
            <option value={c}>{c}</option>
          {/each}
        </select>
        <span class="text-ink-faint text-[10px]">&ndash;</span>
        <select
          class="flex-1 min-w-0 px-1.5 py-1.5 border border-border rounded text-xs bg-surface text-ink-light focus:outline-none cursor-pointer"
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

    <!-- Day -->
    <div class="w-[140px]">
      <span class="text-[10px] font-medium text-ink-faint uppercase tracking-wider">Day</span>
      <div class="mt-0.5">
        <MultiSelect
          options={dayOptions}
          bind:selected={selectedDays}
          onchange={(v) => filterDays.set(v)}
          placeholder="Any"
        />
      </div>
    </div>

    <!-- Period -->
    <div class="w-[160px]">
      <span class="text-[10px] font-medium text-ink-faint uppercase tracking-wider">Period</span>
      <div class="mt-0.5">
        <MultiSelect
          options={periodOptions}
          bind:selected={selectedPeriods}
          onchange={(v) => filterPeriods.set(v)}
          placeholder="Any"
        />
      </div>
    </div>

    <!-- Clear + count -->
    <div class="flex items-center gap-3 pb-0.5">
      {#if hasActiveFilters}
        <button
          onclick={clearFilters}
          class="text-[11px] text-ink-faint hover:text-ink-light transition-colors cursor-pointer whitespace-nowrap"
        >
          Clear filters
        </button>
      {/if}
      <span class="text-[11px] text-ink-faint whitespace-nowrap">
        <span class="font-medium text-ink-light">{$filteredCourses.length}</span>/{$allCourses.length}
      </span>
    </div>
  </div>
</div>
