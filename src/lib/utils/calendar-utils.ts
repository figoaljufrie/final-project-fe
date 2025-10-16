export function formatLocalDate(date: Date | string): string {
  let d: Date;

  if (typeof date === "string") {
    const [year, month, day] = date.split("-").map(Number);
    d = new Date(year, month - 1, day);
  } else {
    // ensure local midnight
    d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day); // always local midnight
}

export function isWithinRange(date: Date, start: Date, end: Date): boolean {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return d >= s && d <= e;
}

export function toLocalMidnight(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function normalizeRange(start: Date, end: Date) {
  return {
    start: toLocalMidnight(start),
    end: toLocalMidnight(end),
  };
}
