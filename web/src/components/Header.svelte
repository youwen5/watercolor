<script>
  import { selectedCourses, totalCredits, selectedIds } from '../lib/stores.js';
  import { exportJSON, exportText } from '../lib/export.js';

  let showExport = $state(false);

  function handleClearAll() {
    if (confirm('Remove all courses from your schedule?')) {
      selectedIds.clear();
    }
  }
</script>

<header class="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-30 shrink-0">
  <div class="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 gap-3">
    <div class="flex items-baseline gap-2 sm:gap-3 min-w-0">
      <h1 class="font-serif text-xl sm:text-2xl tracking-tight text-ink shrink-0">
        <span class="italic">Watercolor</span>
      </h1>
      <span class="text-sm text-ink-faint font-light tracking-wide hidden sm:inline">Tsinghua Course Selector &middot;
        <a href="https://github.com/youwen5/watercolor" target="_blank" rel="noreferrer" class="underline underline-offset-2 hover:text-ink-light transition-colors">Source</a>
      </span>
    </div>

    <div class="flex items-center gap-2 sm:gap-4 shrink-0">
      <div class="text-xs sm:text-sm text-ink-light">
        <span class="font-serif italic text-base sm:text-lg text-ink">{$totalCredits}</span>
        <span class="ml-0.5 sm:ml-1 hidden sm:inline">credits</span>
        <span class="ml-0.5 sm:hidden">cr</span>
        <span class="mx-1 sm:mx-2 text-border">|</span>
        <span class="font-serif italic text-base sm:text-lg text-ink">{$selectedCourses.length}</span>
        <span class="ml-0.5 sm:ml-1 hidden sm:inline">courses</span>
      </div>

      <div class="relative">
        <button
          onclick={() => showExport = !showExport}
          class="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm border border-border rounded hover:bg-surface-alt transition-colors cursor-pointer"
        >
          Export
        </button>

        {#if showExport}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="absolute right-0 top-full mt-1 bg-white border border-border rounded shadow-lg py-1 min-w-[140px] z-40"
            onmouseleave={() => showExport = false}
          >
            <button
              onclick={() => { exportJSON($selectedCourses); showExport = false; }}
              class="block w-full text-left px-4 py-2 text-sm hover:bg-surface-alt transition-colors cursor-pointer"
            >
              Download JSON
            </button>
            <button
              onclick={() => { exportText($selectedCourses); showExport = false; }}
              class="block w-full text-left px-4 py-2 text-sm hover:bg-surface-alt transition-colors cursor-pointer"
            >
              Download Text
            </button>
          </div>
        {/if}
      </div>

      {#if $selectedCourses.length > 0}
        <button
          onclick={handleClearAll}
          class="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm text-conflict border border-conflict/30 rounded hover:bg-conflict/5 transition-colors cursor-pointer"
        >
          Clear
        </button>
      {/if}
    </div>
  </div>
</header>
