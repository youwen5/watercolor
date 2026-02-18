<script module>
  import { writable } from 'svelte/store';
  export const detailCourse = writable(null);
</script>

<script>
  import { DAYS, PERIODS } from '../lib/constants.js';
  import { formatWeeks } from '../lib/parser.js';
  import { selectedIds } from '../lib/stores.js';

  function close() {
    detailCourse.set(null);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') close();
  }

  function dayName(id) {
    return DAYS.find(d => d.id === id)?.name || `Day ${id}`;
  }

  function periodLabel(id) {
    const p = PERIODS.find(p => p.id === id);
    return p ? `P${p.id} ${p.time}` : `P${id}`;
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if $detailCourse}
  <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-ink/20 backdrop-blur-sm" onclick={close}></div>

    <div class="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
      <button
        onclick={close}
        class="absolute top-4 right-4 text-ink-faint hover:text-ink text-xl leading-none cursor-pointer"
        aria-label="Close"
      >
        &times;
      </button>

      <h3 class="font-serif italic text-xl text-ink pr-8">{$detailCourse.title_en}</h3>
      <p class="text-sm text-ink-light mt-1">{$detailCourse.title_zh}</p>

      <div class="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 text-sm">
        <div>
          <span class="text-ink-faint">Course Number</span>
          <div class="text-ink">{$detailCourse.course_number}</div>
        </div>
        <div>
          <span class="text-ink-faint">Credits</span>
          <div class="text-ink">{$detailCourse.credit}</div>
        </div>
        <div>
          <span class="text-ink-faint">Department</span>
          <div class="text-ink">{$detailCourse.department}</div>
        </div>
        <div>
          <span class="text-ink-faint">Instructor</span>
          <div class="text-ink">{$detailCourse.instructor}</div>
        </div>
      </div>

      {#if $detailCourse.slots.length > 0}
        <div class="mt-4">
          <span class="text-sm text-ink-faint">Schedule</span>
          <div class="mt-1 space-y-1">
            {#each $detailCourse.slots as slot}
              <div class="text-sm text-ink">
                {dayName(slot.day)} {periodLabel(slot.period)}
                <span class="text-ink-faint ml-1">{formatWeeks(slot.weeks)}</span>
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <div class="mt-4 text-sm italic text-ink-faint">Time not yet determined</div>
      {/if}

      {#if $detailCourse.remarks}
        <div class="mt-4">
          <span class="text-sm text-ink-faint">Remarks</span>
          <p class="text-sm text-ink mt-1">{$detailCourse.remarks}</p>
        </div>
      {/if}

      {#if $detailCourse.course_features}
        <div class="mt-3">
          <span class="text-sm text-ink-faint">Features</span>
          <p class="text-sm text-ink mt-1">{$detailCourse.course_features}</p>
        </div>
      {/if}

      <div class="mt-6 flex justify-end">
        <button
          onclick={() => { selectedIds.remove($detailCourse.id); close(); }}
          class="px-4 py-2 text-sm text-conflict border border-conflict/30 rounded hover:bg-conflict/5 transition-colors cursor-pointer"
        >
          Remove from schedule
        </button>
      </div>
    </div>
  </div>
{/if}
