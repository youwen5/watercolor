<script>
  import { onMount } from 'svelte';
  import { allCourses, mobileView } from './lib/stores.js';
  import Header from './components/Header.svelte';
  import FilterBar from './components/FilterBar.svelte';
  import SearchPanel from './components/SearchPanel.svelte';
  import Calendar from './components/Calendar.svelte';
  import WeekSelector from './components/WeekSelector.svelte';
  import ConflictModal from './components/ConflictModal.svelte';
  import CourseDetail from './components/CourseDetail.svelte';
  import AddCustomItemModal from './components/AddCustomItemModal.svelte';

  let loading = $state(true);

  onMount(async () => {
    await allCourses.load();
    loading = false;
  });
</script>

{#if loading}
  <div class="flex items-center justify-center min-h-screen">
    <p class="font-serif text-2xl italic text-ink-light tracking-wide">Loading courses...</p>
  </div>
{:else}
  <!-- Desktop layout -->
  <div class="hidden lg:flex h-screen flex-col overflow-hidden">
    <Header />
    <FilterBar />
    <div class="flex flex-1 min-h-0">
      <SearchPanel />
      <main class="flex-1 flex flex-col min-h-0 min-w-0">
        <WeekSelector />
        <div class="flex-1 min-h-0 overflow-auto p-4">
          <Calendar />
        </div>
      </main>
    </div>
  </div>

  <!-- Mobile layout -->
  <div class="flex lg:hidden h-dvh flex-col overflow-hidden">
    <Header />

    <!-- Mobile tab bar -->
    <nav class="shrink-0 border-b border-border bg-white flex">
      <button
        onclick={() => mobileView.set('search')}
        class="flex-1 py-2.5 text-sm text-center transition-colors cursor-pointer
          {$mobileView === 'search'
            ? 'text-ink font-medium border-b-2 border-ink -mb-px'
            : 'text-ink-faint'}"
      >
        Courses
      </button>
      <button
        onclick={() => mobileView.set('schedule')}
        class="flex-1 py-2.5 text-sm text-center transition-colors cursor-pointer
          {$mobileView === 'schedule'
            ? 'text-ink font-medium border-b-2 border-ink -mb-px'
            : 'text-ink-faint'}"
      >
        Schedule
      </button>
    </nav>

    {#if $mobileView === 'search'}
      <FilterBar />
      <div class="flex-1 min-h-0 flex flex-col overflow-hidden">
        <SearchPanel mobile={true} />
      </div>
    {:else}
      <main class="flex-1 flex flex-col min-h-0">
        <WeekSelector />
        <div class="flex-1 min-h-0 overflow-auto p-3">
          <Calendar />
        </div>
      </main>
    {/if}
  </div>

  <ConflictModal />
  <CourseDetail />
  <AddCustomItemModal />
{/if}
