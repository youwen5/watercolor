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
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex items-center gap-2 px-4 py-2 border-b border-border-light bg-white/50">
  <button
    onclick={prev}
    class="w-7 h-7 flex items-center justify-center rounded text-ink-light hover:bg-surface-alt transition-colors cursor-pointer"
    disabled={$currentWeek === 1}
  >
    &larr;
  </button>

  <div class="flex gap-0.5 flex-1 justify-center">
    {#each weeks as w}
      <button
        onclick={() => currentWeek.set(w)}
        class="w-8 h-7 text-xs rounded transition-all cursor-pointer
          {$currentWeek === w
            ? 'bg-ink text-white font-medium'
            : $currentWeek === null
              ? 'bg-ink/10 text-ink-light hover:bg-ink/20'
              : 'text-ink-faint hover:bg-surface-alt hover:text-ink-light'
          }"
      >
        {w}
      </button>
    {/each}
  </div>

  <button
    onclick={next}
    class="w-7 h-7 flex items-center justify-center rounded text-ink-light hover:bg-surface-alt transition-colors cursor-pointer"
    disabled={$currentWeek === MAX_WEEK}
  >
    &rarr;
  </button>

  <button
    onclick={toggleAll}
    class="ml-2 px-3 py-1 text-xs border rounded transition-colors cursor-pointer
      {$currentWeek === null
        ? 'border-ink bg-ink text-white'
        : 'border-border text-ink-light hover:bg-surface-alt'
      }"
  >
    All
  </button>
</div>
