import { DAYS, PERIODS } from './constants.js';

/**
 * Export selected courses as a JSON download.
 */
export function exportJSON(selectedCourses) {
  const data = selectedCourses.map(c => ({
    title_en: c.title_en,
    title_zh: c.title_zh,
    course_number: c.course_number,
    credit: c.credit,
    department: c.department,
    instructor: c.instructor,
    class_time: c.class_time,
  }));

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  download(blob, 'watercolor-schedule.json');
}

/**
 * Export selected courses as a formatted text schedule.
 */
export function exportText(selectedCourses) {
  const lines = ['Watercolor Schedule', '='.repeat(60), ''];

  // Summary
  const totalCredits = selectedCourses.reduce((sum, c) => sum + parseInt(c.credit, 10), 0);
  lines.push(`Total courses: ${selectedCourses.length}`);
  lines.push(`Total credits: ${totalCredits}`);
  lines.push('');

  // Weekly table
  const dayWidth = 30;
  const header = 'Period'.padEnd(14) + DAYS.slice(0, 5).map(d => d.short.padEnd(dayWidth)).join('');
  lines.push(header);
  lines.push('-'.repeat(header.length));

  for (const period of PERIODS) {
    const row = [(`P${period.id} ${period.time}`).padEnd(14)];
    for (let dayId = 1; dayId <= 5; dayId++) {
      const coursesInCell = selectedCourses.filter(c =>
        c.slots.some(s => s.day === dayId && s.period === period.id)
      );
      const cell = coursesInCell.map(c => c.title_en.slice(0, 26)).join('; ') || '';
      row.push(cell.padEnd(dayWidth));
    }
    lines.push(row.join(''));
  }

  lines.push('');

  // Course list
  lines.push('Course Details');
  lines.push('-'.repeat(40));
  for (const c of selectedCourses) {
    lines.push(`${c.title_en} (${c.title_zh})`);
    lines.push(`  ${c.course_number} | ${c.credit} credits | ${c.department}`);
    lines.push(`  ${c.instructor} | ${c.class_time}`);
    lines.push('');
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  download(blob, 'watercolor-schedule.txt');
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
