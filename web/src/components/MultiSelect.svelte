<script>
  /** @type {{ options: Array<{value: any, label: string}>, selected?: any[], onchange?: (selected: any[]) => void, placeholder?: string, searchable?: boolean }} */
  let {
    options = [],
    selected = $bindable([]),
    onchange,
    placeholder = 'Select...',
    searchable = false,
  } = $props();

  let open = $state(false);
  let query = $state('');
  let containerEl = $state(null);
  let inputEl = $state(null);

  let filtered = $derived(
    searchable && query
      ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
      : options
  );

  function isSelected(value) {
    return selected.includes(value);
  }

  function toggle(value) {
    if (isSelected(value)) {
      selected = selected.filter(v => v !== value);
    } else {
      selected = [...selected, value];
    }
    onchange?.(selected);
  }

  function remove(value) {
    selected = selected.filter(v => v !== value);
    onchange?.(selected);
  }

  function clearAll() {
    selected = [];
    query = '';
    onchange?.(selected);
  }

  function labelFor(value) {
    return options.find(o => o.value === value)?.label ?? String(value);
  }

  function handleClickOutside(e) {
    if (containerEl && !containerEl.contains(e.target)) {
      open = false;
      query = '';
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      open = false;
      query = '';
    }
  }
</script>

<svelte:document onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class="relative" bind:this={containerEl}>
  <!-- Trigger -->
  <button
    type="button"
    class="w-full min-h-[34px] px-2 py-1 border rounded text-left text-xs bg-surface
      flex flex-wrap items-center gap-1 cursor-pointer transition-colors
      {open ? 'border-ink-faint' : 'border-border'}"
    onclick={() => {
      open = !open;
      if (open && searchable) {
        // defer focus to next tick so the input exists
        setTimeout(() => inputEl?.focus(), 0);
      }
    }}
  >
    {#if selected.length === 0}
      <span class="text-ink-faint">{placeholder}</span>
    {:else}
      {#each selected as value}
        <span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-alt text-ink text-[11px] leading-tight">
          {labelFor(value)}
          <button
            type="button"
            class="ml-0.5 text-ink-faint hover:text-ink transition-colors cursor-pointer"
            onclick={(e) => { e.stopPropagation(); remove(value); }}
            aria-label="Remove {labelFor(value)}"
          >&times;</button>
        </span>
      {/each}
      {#if selected.length > 0}
        <button
          type="button"
          class="ml-auto text-ink-faint hover:text-ink-light text-[11px] cursor-pointer transition-colors"
          onclick={(e) => { e.stopPropagation(); clearAll(); }}
          aria-label="Clear all"
        >&times;</button>
      {/if}
    {/if}
  </button>

  <!-- Dropdown -->
  {#if open}
    <div class="absolute z-50 mt-1 w-full bg-white border border-border rounded shadow-sm max-h-56 overflow-y-auto">
      {#if searchable}
        <div class="sticky top-0 bg-white border-b border-border-light p-1.5">
          <input
            bind:this={inputEl}
            type="text"
            class="w-full px-2 py-1 border border-border rounded text-xs bg-surface placeholder:text-ink-faint focus:outline-none focus:border-ink-faint"
            placeholder="Search..."
            bind:value={query}
            onclick={(e) => e.stopPropagation()}
          />
        </div>
      {/if}

      {#each filtered as option (option.value)}
        <button
          type="button"
          class="w-full px-3 py-1.5 text-left text-xs cursor-pointer transition-colors flex items-center gap-2
            {isSelected(option.value) ? 'bg-surface-alt text-ink font-medium' : 'text-ink-light hover:bg-surface-hover'}"
          onclick={(e) => { e.stopPropagation(); toggle(option.value); }}
        >
          <span class="w-3.5 h-3.5 shrink-0 border rounded-sm flex items-center justify-center text-[10px]
            {isSelected(option.value) ? 'border-ink bg-ink text-white' : 'border-border'}">
            {#if isSelected(option.value)}&#10003;{/if}
          </span>
          {option.label}
        </button>
      {:else}
        <div class="px-3 py-2 text-xs text-ink-faint italic">No matches</div>
      {/each}
    </div>
  {/if}
</div>
