export function formatLocalDate(date: Date): string {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const year = local.getFullYear();
  const month = `${local.getMonth() + 1}`.padStart(2, "0");
  const day = `${local.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function isWithinRange(date: Date, start: Date, end: Date): boolean {
  const d = parseLocalDate(formatLocalDate(date));
  const s = parseLocalDate(formatLocalDate(start));
  const e = parseLocalDate(formatLocalDate(end));
  return d >= s && d <= e;
}
