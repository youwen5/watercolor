<script>
  import { currentWeek } from '../lib/stores.js';
  import { MAX_WEEK } from '../lib/constants.js';

  const weeks = Array.from({ length: MAX_WEEK }, (_, i) => i + 1);

  function prev() {
    currentWeek.update(w => {
      if (w === null) return MAX_WEEK;
      return w > 1 ? w - 1 : 1;
    });
  }

  function next() {
    currentWeek.update(w => {
      if (w === null) return 1;
      return w < MAX_WEEK ? w + 1 : MAX_WEEK;
    });
  }

  function toggleAll() {
    currentWeek.update(w => w === null ? 1 : null);
  }

  function handleKeydown(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="border-b border-border bg-white px-3 sm:px-4 py-2 sm:py-3">
  <div class="flex items-center gap-2 sm:gap-3">
    <div class="shrink-0">
      <span class="font-serif italic text-sm text-ink-light tracking-wide">Week</span>
      {#if $currentWeek !== null}
        <span class="font-serif text-xl sm:text-2xl text-ink ml-1 tabular-nums">{$currentWeek}</span>
        <span class="text-xs text-ink-faint ml-0.5">/ {MAX_WEEK}</span>
      {:else}
        <span class="font-serif italic text-lg text-ink ml-1">All</span>
      {/if}
    </div>

    <div class="flex items-center gap-1 flex-1 min-w-0">
      <button
        onclick={prev}
        class="shrink-0 w-7 h-7 flex items-center justify-center rounded text-ink-light hover:bg-surface-alt disabled:opacity-30 transition-colors cursor-pointer"
        disabled={$currentWeek === 1}
        aria-label="Previous week"
      >
        &larr;
      </button>

      <div class="flex gap-px flex-1 overflow-x-auto scrollbar-none">
        {#each weeks as w}
          <button
            onclick={() => currentWeek.set(w)}
            class="shrink-0 w-7 sm:w-auto sm:flex-1 sm:max-w-[36px] h-7 sm:h-8 text-xs rounded-sm transition-all cursor-pointer
              {$currentWeek === w
                ? 'bg-ink text-white font-semibold shadow-sm'
                : $currentWeek === null
                  ? 'bg-ink/8 text-ink-light hover:bg-ink/15 font-medium'
                  : 'text-ink-faint hover:bg-surface-alt hover:text-ink-light'
              }"
            aria-label="Week {w}"
            aria-current={$currentWeek === w ? 'true' : undefined}
          >
            {w}
          </button>
        {/each}
      </div>

      <button
        onclick={next}
        class="shrink-0 w-7 h-7 flex items-center justify-center rounded text-ink-light hover:bg-surface-alt disabled:opacity-30 transition-colors cursor-pointer"
        disabled={$currentWeek === MAX_WEEK}
        aria-label="Next week"
      >
        &rarr;
      </button>
    </div>

    <button
      onclick={toggleAll}
      class="shrink-0 px-2 sm:px-3 py-1.5 text-xs border rounded transition-colors cursor-pointer whitespace-nowrap
        {$currentWeek === null
          ? 'border-ink bg-ink text-white font-medium'
          : 'border-border text-ink-light hover:bg-surface-alt hover:border-ink-faint'
        }"
    >
      All
    </button>
  </div>

  <p class="hidden sm:block text-[10px] text-ink-faint mt-1.5 tracking-wide">
    {$currentWeek !== null
      ? `Showing courses scheduled in week ${$currentWeek}. Use \u2190 \u2192 arrow keys to navigate. Click on calendar blocks to search for courses during that time period or add custom blocks.`
      : 'Showing all courses regardless of week. Click a week number to filter. Click on calendar blocks to search for courses during that time period or add custom blocks.'}
  </p>
</div>
