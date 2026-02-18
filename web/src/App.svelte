<script>
  import { onMount } from 'svelte';
  import { allCourses } from './lib/stores.js';
  import Header from './components/Header.svelte';
  import SearchPanel from './components/SearchPanel.svelte';
  import Calendar from './components/Calendar.svelte';
  import WeekSelector from './components/WeekSelector.svelte';
  import ConflictModal from './components/ConflictModal.svelte';
  import CourseDetail from './components/CourseDetail.svelte';

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
  <div class="h-screen flex flex-col overflow-hidden">
    <Header />
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
  <ConflictModal />
  <CourseDetail />
{/if}
