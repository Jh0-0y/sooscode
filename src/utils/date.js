// yyyy-MM-dd
export function formatDate(dateString) {
  if (!dateString) return "";

  try {
    return dateString.split("T")[0];
  } catch {
    return "";
  }
}

// yyyy-MM-dd HH:mm:ss
export function formatDateTime(dateString) {
  if (!dateString) return "";

  try {
    const [datePart, timePart] = dateString.split("T");
    const time = timePart?.split(".")[0];

    return `${datePart} ${time}`;
  } catch {
    return "";
  }
}


/* usage
import { formatDate, formatDateTime } from "@/common/utils/date";

1) 년월일
formatDate("2025-12-09T15:36:01.795388")  
// → "2025-12-09"

2) 년월일 + 시:분:초
formatDateTime("2025-12-09T15:36:01.795388")
// → "2025-12-09 15:36:01"
*/
