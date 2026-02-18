export const PERIODS = [
  { id: 1, name: 'Morning I', sections: '1–2', time: '8:00 – 9:35' },
  { id: 2, name: 'Morning II', sections: '3–5', time: '9:50 – 12:15' },
  { id: 3, name: 'Afternoon I', sections: '6–7', time: '13:30 – 15:05' },
  { id: 4, name: 'Afternoon II', sections: '8–9', time: '15:20 – 16:55' },
  { id: 5, name: 'Late Afternoon', sections: '10–11', time: '17:05 – 18:40' },
  { id: 6, name: 'Evening', sections: '12–14', time: '19:20 – 21:45' },
];

export const DAYS = [
  { id: 1, short: 'Mon', name: 'Monday' },
  { id: 2, short: 'Tue', name: 'Tuesday' },
  { id: 3, short: 'Wed', name: 'Wednesday' },
  { id: 4, short: 'Thu', name: 'Thursday' },
  { id: 5, short: 'Fri', name: 'Friday' },
  { id: 6, short: 'Sat', name: 'Saturday' },
  { id: 7, short: 'Sun', name: 'Sunday' },
];

export const MAX_WEEK = 16;

// Muted, earthy palette — each hue distinct enough to read on white
export const PALETTE = [
  '#8b5cf6', // violet
  '#0891b2', // cyan
  '#059669', // emerald
  '#d97706', // amber
  '#dc2626', // red
  '#7c3aed', // purple
  '#0284c7', // sky
  '#16a34a', // green
  '#ea580c', // orange
  '#db2777', // pink
  '#4f46e5', // indigo
  '#0d9488', // teal
  '#65a30d', // lime
  '#ca8a04', // yellow
  '#9333ea', // fuchsia-purple
  '#2563eb', // blue
];

export function courseColor(index) {
  return PALETTE[index % PALETTE.length];
}
