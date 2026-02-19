import { writable, derived } from 'svelte/store';
import { parseClassTime } from './parser.js';
import { MAX_WEEK, courseColor } from './constants.js';

// ── Raw course data (loaded once) ──────────────────────────────
function createCoursesStore() {
  const { subscribe, set } = writable([]);

  return {
    subscribe,
    async load() {
      const res = await fetch('/courses.json');
      const raw = await res.json();
      const parsed = raw.map((c, i) => ({
        ...c,
        id: i,
        credit: parseInt(c.credit, 10) || 0,
        slots: parseClassTime(c.class_time),
        schedulable: parseClassTime(c.class_time).length > 0,
      }));
      set(parsed);
    },
  };
}

export const allCourses = createCoursesStore();

// ── Selection ──────────────────────────────────────────────────
function createSelectionStore() {
  // Restore from localStorage
  let initial = [];
  try {
    const saved = localStorage.getItem('watercolor-selected');
    if (saved) initial = JSON.parse(saved);
  } catch {}

  const { subscribe, update, set } = writable(initial);

  // Persist on change
  const store = {
    subscribe,
    add(courseId) {
      update(ids => {
        if (ids.includes(courseId)) return ids;
        const next = [...ids, courseId];
        localStorage.setItem('watercolor-selected', JSON.stringify(next));
        return next;
      });
    },
    remove(courseId) {
      update(ids => {
        const next = ids.filter(id => id !== courseId);
        localStorage.setItem('watercolor-selected', JSON.stringify(next));
        return next;
      });
    },
    clear() {
      set([]);
      localStorage.setItem('watercolor-selected', '[]');
    },
    set(ids) {
      set(ids);
      localStorage.setItem('watercolor-selected', JSON.stringify(ids));
    },
  };

  return store;
}

export const selectedIds = createSelectionStore();

// ── Current week (null = "all weeks") ─────────────────────────
export const currentWeek = writable(1);

// ── Mobile view tab ───────────────────────────────────────────
export const mobileView = writable('search'); // 'search' | 'schedule'

// ── Search & filters ──────────────────────────────────────────
export const searchQuery = writable('');
export const filterDepartments = writable([]); // array of department strings
export const filterCreditMin = writable('');    // '' = no min
export const filterCreditMax = writable('');    // '' = no max
export const filterDays = writable([]);       // array of day ids (numbers)
export const filterPeriods = writable([]);     // array of period ids (numbers)

// ── Derived: selected courses with color ──────────────────────
export const selectedCourses = derived(
  [allCourses, selectedIds],
  ([$all, $ids]) => {
    if ($all.length === 0) return [];
    return $ids
      .map((id, i) => {
        const course = $all.find(c => c.id === id);
        if (!course) return null;
        return { ...course, color: courseColor(i) };
      })
      .filter(Boolean);
  }
);

// ── Derived: filtered courses for search ──────────────────────
export const filteredCourses = derived(
  [allCourses, searchQuery, filterDepartments, filterCreditMin, filterCreditMax, filterDays, filterPeriods],
  ([$all, $query, $depts, $creditMin, $creditMax, $days, $periods]) => {
    let result = $all;

    if ($query) {
      const q = $query.toLowerCase();
      result = result.filter(c =>
        c.title_en.toLowerCase().includes(q) ||
        c.title_zh.includes($query) ||
        c.instructor.toLowerCase().includes(q) ||
        c.course_number.includes($query)
      );
    }

    if ($depts.length > 0) {
      result = result.filter(c => $depts.includes(c.department));
    }

    if ($creditMin) {
      const min = parseInt($creditMin, 10);
      result = result.filter(c => c.credit >= min);
    }

    if ($creditMax) {
      const max = parseInt($creditMax, 10);
      result = result.filter(c => c.credit <= max);
    }

    if ($days.length > 0) {
      result = result.filter(c => c.slots.some(s => $days.includes(s.day)));
    }

    if ($periods.length > 0) {
      result = result.filter(c => c.slots.some(s => $periods.includes(s.period)));
    }

    return result;
  }
);

// ── Derived: calendar grid for current week ───────────────────
// Returns Map of "day-period" -> [{ course, slot }]
export const calendarGrid = derived(
  [selectedCourses, currentWeek],
  ([$selected, $week]) => {
    const grid = new Map();

    for (const course of $selected) {
      for (const slot of course.slots) {
        if ($week === null || slot.weeks.has($week)) {
          const key = `${slot.day}-${slot.period}`;
          if (!grid.has(key)) grid.set(key, []);
          grid.get(key).push({ course, slot });
        }
      }
    }

    return grid;
  }
);

// ── Derived: total credits ────────────────────────────────────
export const totalCredits = derived(
  selectedCourses,
  $selected => $selected.reduce((sum, c) => sum + c.credit, 0)
);

// ── Derived: departments list ─────────────────────────────────
export const departments = derived(
  allCourses,
  $all => [...new Set($all.map(c => c.department))].sort()
);

// ── Derived: whether weekends are needed ──────────────────────
export const hasWeekendCourses = derived(
  selectedCourses,
  $selected => $selected.some(c => c.slots.some(s => s.day >= 6))
);

// ── Derived: whether period 5 or higher is needed ─────────────
export const maxPeriod = derived(
  selectedCourses,
  $selected => {
    let max = 4; // Show at least 4 periods by default
    for (const c of $selected) {
      for (const s of c.slots) {
        if (s.period > max) max = s.period;
      }
    }
    return max;
  }
);
