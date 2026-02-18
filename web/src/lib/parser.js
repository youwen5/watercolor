/**
 * Parse a weeks string like "1-16", "1,3,5,7,9,11,13,15", or "5,8,12-13"
 * into a Set of week numbers.
 */
export function parseWeeks(str) {
  const weeks = new Set();
  for (const part of str.split(',')) {
    const trimmed = part.trim();
    const range = trimmed.match(/^(\d+)-(\d+)$/);
    if (range) {
      const start = parseInt(range[1], 10);
      const end = parseInt(range[2], 10);
      for (let i = start; i <= end; i++) weeks.add(i);
    } else {
      const n = parseInt(trimmed, 10);
      if (!isNaN(n)) weeks.add(n);
    }
  }
  return weeks;
}

/**
 * Parse a class_time string into an array of time slots.
 *
 * Format: "DAY-PERIOD(week WEEKS)" — comma-separated for multiple slots.
 * DAY: 1-7, PERIOD: 1-6 (rarely 7), WEEKS: ranges or lists.
 *
 * Returns: Array<{ day: number, period: number, weeks: Set<number> }>
 *
 * If the string has no parseable day-period slots, returns an empty array
 * (the course is "unschedulable").
 */
export function parseClassTime(str) {
  if (!str || !str.trim()) return [];

  const slots = [];
  // Match patterns like "2-4(week 1,3,5,7,9,11,13,15)"
  const re = /(\d)-(\d)\(week\s+([^)]+)\)/g;
  let match;
  while ((match = re.exec(str)) !== null) {
    slots.push({
      day: parseInt(match[1], 10),
      period: parseInt(match[2], 10),
      weeks: parseWeeks(match[3]),
    });
  }
  return slots;
}

/**
 * Format a parsed time slots array into a human-readable string.
 */
export function formatTimeSlots(slots) {
  if (!slots || slots.length === 0) return 'Time TBD';

  const dayNames = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const periodNames = ['', 'P1 8:00', 'P2 9:50', 'P3 13:30', 'P4 15:20', 'P5 17:05', 'P6 19:20', 'P7'];

  // Group by weeks to condense display
  return slots.map(s => `${dayNames[s.day]} ${periodNames[s.period]}`).join(', ');
}

/**
 * Format weeks set into a compact string like "1-16" or "1,3,5,...,15"
 */
export function formatWeeks(weeks) {
  if (!weeks || weeks.size === 0) return '';
  const sorted = [...weeks].sort((a, b) => a - b);
  if (sorted.length === 0) return '';

  // Check if it's a simple contiguous range
  if (sorted[sorted.length - 1] - sorted[0] + 1 === sorted.length) {
    if (sorted[0] === 1 && sorted[sorted.length - 1] === 16) return 'All weeks';
    return `W${sorted[0]}–${sorted[sorted.length - 1]}`;
  }

  // Check for odd/even pattern
  const allOdd = sorted.every(w => w % 2 === 1);
  const allEven = sorted.every(w => w % 2 === 0);
  if (allOdd) return `W${sorted[0]},${sorted[1]},...,${sorted[sorted.length - 1]} (odd)`;
  if (allEven) return `W${sorted[0]},${sorted[1]},...,${sorted[sorted.length - 1]} (even)`;

  if (sorted.length <= 4) return sorted.map(w => `W${w}`).join(',');
  return `W${sorted[0]},${sorted[1]},...,${sorted[sorted.length - 1]}`;
}
