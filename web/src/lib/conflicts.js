/**
 * Check if two sets have any common elements.
 */
function setsOverlap(a, b) {
  for (const v of a) {
    if (b.has(v)) return true;
  }
  return false;
}

/**
 * Get the intersection of two sets.
 */
function setsIntersection(a, b) {
  const result = new Set();
  for (const v of a) {
    if (b.has(v)) result.add(v);
  }
  return result;
}

/**
 * Find conflicts between a new course and existing selected courses.
 *
 * Returns an array of conflict descriptions:
 * [{ existing: Course, day, period, overlappingWeeks: Set }]
 */
export function findConflicts(selectedCourses, newCourse) {
  const conflicts = [];

  for (const existing of selectedCourses) {
    for (const newSlot of newCourse.slots) {
      for (const existSlot of existing.slots) {
        if (newSlot.day === existSlot.day && newSlot.period === existSlot.period) {
          const overlap = setsIntersection(newSlot.weeks, existSlot.weeks);
          if (overlap.size > 0) {
            conflicts.push({
              existing,
              day: newSlot.day,
              period: newSlot.period,
              overlappingWeeks: overlap,
            });
          }
        }
      }
    }
  }

  return conflicts;
}

/**
 * Get all conflicts in the current calendar grid for a given week.
 * Returns a Map of "day-period" -> array of courses in that cell.
 * Only includes entries where more than one course occupies the cell.
 */
export function getConflictsForWeek(selectedCourses, week) {
  const grid = new Map();

  for (const course of selectedCourses) {
    for (const slot of course.slots) {
      if (week === null || slot.weeks.has(week)) {
        const key = `${slot.day}-${slot.period}`;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key).push(course);
      }
    }
  }

  // Filter to only conflicting cells
  const conflicts = new Map();
  for (const [key, courses] of grid) {
    if (courses.length > 1) conflicts.set(key, courses);
  }
  return conflicts;
}
