<script>
  import { customItems } from '../lib/stores.js';
  import { formatWeeks } from '../lib/parser.js';

  let { item, showWeekBadge = false } = $props();

  function remove(e) {
    e.stopPropagation();
    customItems.remove(item.id);
  }
</script>

<div
  class="group rounded px-2 py-1.5 text-white text-[11px] leading-tight relative overflow-hidden"
  style="background-color: {item.color};"
  title={item.title}
>
  <button
    onclick={remove}
    class="absolute top-0.5 right-1 opacity-0 group-hover:opacity-80 text-white/80 hover:text-white text-sm leading-none cursor-pointer"
    aria-label="Remove {item.title}"
  >
    &times;
  </button>

  <div class="font-medium truncate pr-3">{item.title}</div>

  {#if showWeekBadge}
    <div class="mt-0.5 text-[9px] opacity-60 truncate">
      {formatWeeks(item.weeks)}
    </div>
  {/if}
</div>
