import { format, addDays, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

export function generateDateRange(startDate, endDate, snapshotDates = []) {
  let result = [];
  let cur = parseISO(startDate);
  let end = parseISO(endDate);

  const snapshotSet = new Set(snapshotDates);

  while (cur <= end) {
    const raw = format(cur, "yyyy-MM-dd");
    result.push({
      raw, // yyyy-MM-dd
      label: format(cur, "yyyy년 M월 d일", { locale: ko }),
      weekday: format(cur, "EEEE", { locale: ko }),
      hasSnapshot: snapshotSet.has(raw),
    });
    cur = addDays(cur, 1);
  }

  return result;
}
