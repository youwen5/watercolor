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
    filterEnglishOnly,
    filterBilingualMajorityEnglish,
    filterBilingualMajorityChinese,
    departments,
  } from '../lib/stores.js';
  import { DAYS, PERIODS } from '../lib/constants.js';
  import MultiSelect from './MultiSelect.svelte';

  let selectedDepts = $state([]);
  let selectedDays = $state([]);
  let selectedPeriods = $state([]);

  // Sync local state when stores are set externally (e.g. from calendar slot action)
  $effect(() => { selectedDays = [...$filterDays]; });
  $effect(() => { selectedPeriods = [...$filterPeriods]; });

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
    filterEnglishOnly.set(false);
    filterBilingualMajorityEnglish.set(false);
    filterBilingualMajorityChinese.set(false);
  }

  let hasActiveFilters = $derived(
    $searchQuery || $filterDepartments.length > 0 || $filterCreditMin || $filterCreditMax || $filterDays.length > 0 || $filterPeriods.length > 0 || $filterEnglishOnly || $filterBilingualMajorityEnglish || $filterBilingualMajorityChinese
  );

  let filtersOpen = $state(false);
  let filtersSettled = $state(false);

  function toggleFilters() {
    filtersOpen = !filtersOpen;
    if (!filtersOpen) filtersSettled = false;
  }

  function onTransitionEnd() {
    if (filtersOpen) filtersSettled = true;
  }

  let activeFilterCount = $derived(
    ($filterDepartments.length > 0 ? 1 : 0) +
    ($filterCreditMin || $filterCreditMax ? 1 : 0) +
    ($filterDays.length > 0 ? 1 : 0) +
    ($filterPeriods.length > 0 ? 1 : 0) +
    ($filterEnglishOnly ? 1 : 0)
  );
</script>

<div class="shrink-0 border-b border-border bg-white px-4 py-2">
  <!-- On desktop: single flex-wrap row for all filters. On mobile: block container. -->
  <div class="lg:flex lg:flex-wrap lg:items-end lg:gap-x-3 lg:gap-y-2">

    <!-- Search + mobile toggle. lg:contents dissolves this wrapper on desktop. -->
    <div class="flex items-end gap-2 lg:contents">
      <div class="flex-1 min-w-0 lg:min-w-[180px]">
        <span class="text-[10px] font-medium text-ink-faint uppercase tracking-wider">Search</span>
        <input
          type="text"
          placeholder="Name, instructor, or number..."
          class="mt-0.5 w-full px-2.5 py-1.5 border border-border rounded text-xs bg-surface placeholder:text-ink-faint focus:outline-none focus:border-ink-faint transition-colors"
          oninput={(e) => searchQuery.set(e.target.value)}
          value={$searchQuery}
        />
      </div>
      <!-- Mobile filter toggle -->
      <button
        onclick={toggleFilters}
        class="lg:hidden shrink-0 mb-px px-2.5 py-1.5 border rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5
          {filtersOpen || activeFilterCount > 0
            ? 'border-ink bg-ink text-white hover:bg-ink-light'
            : 'border-border text-ink-light hover:text-ink hover:bg-surface-alt'}"
        aria-label={filtersOpen ? 'Hide filters' : 'Show filters'}
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M1 3h14M3 8h10M5.5 13h5" />
        </svg>
        <span>Filters</span>
        {#if activeFilterCount > 0}
          <span class="text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none font-medium
            {filtersOpen ? 'bg-white text-ink' : 'bg-ink text-white'}">{activeFilterCount}</span>
        {/if}
      </button>
    </div>

    <!-- Collapsible filter section. lg:contents dissolves on desktop so items join the flex-wrap. -->
    <div
      class="grid transition-[grid-template-rows] duration-200 ease-out lg:contents"
      class:overflow-hidden={!filtersSettled}
      style:grid-template-rows={filtersOpen ? '1fr' : '0fr'}
      ontransitionend={onTransitionEnd}
    >
      <div class="min-h-0 lg:contents" class:overflow-hidden={!filtersSettled}>
        <div class="flex flex-wrap items-end gap-x-3 gap-y-2 pt-2 lg:contents">

          <!-- Department -->
          <div class="w-full sm:w-[200px]">
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
          <div class="w-full sm:w-[130px]">
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
          <div class="w-full sm:w-[140px]">
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
          <div class="w-full sm:w-[160px]">
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

        </div>
      </div>
    </div>
  </div>

  <!-- Clear + count -->
  <div class="flex items-center gap-3 mt-1.5">
    <span class="text-[11px] text-ink-faint">
      Showing <span class="font-medium text-ink-light">{$filteredCourses.length}</span> courses out of {$allCourses.length}
    </span>
    {#if hasActiveFilters}
      <button
        onclick={clearFilters}
        class="text-[11px] text-ink-faint hover:text-ink-light transition-colors cursor-pointer whitespace-nowrap"
      >
        Clear filters
      </button>
    {/if}
  </div>

  <!-- Language filter checkboxes -->
  <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
    <label class="flex items-center gap-1.5 text-[11px] text-ink-faint cursor-pointer select-none">
      <input
        type="checkbox"
        checked={$filterEnglishOnly}
        onchange={(e) => filterEnglishOnly.set(e.target.checked)}
        class="accent-ink w-3 h-3 cursor-pointer"
      />
      English only
    </label>
    <label class="flex items-center gap-1.5 text-[11px] text-ink-faint cursor-pointer select-none">
      <input
        type="checkbox"
        checked={$filterBilingualMajorityEnglish}
        onchange={(e) => filterBilingualMajorityEnglish.set(e.target.checked)}
        class="accent-ink w-3 h-3 cursor-pointer"
      />
      Bilingual (majority English)
    </label>
    <label class="flex items-center gap-1.5 text-[11px] text-ink-faint cursor-pointer select-none">
      <input
        type="checkbox"
        checked={$filterBilingualMajorityChinese}
        onchange={(e) => filterBilingualMajorityChinese.set(e.target.checked)}
        class="accent-ink w-3 h-3 cursor-pointer"
      />
      Bilingual (majority Chinese)
    </label>
  </div>
</div>
