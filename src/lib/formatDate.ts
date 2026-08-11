/**
 * Formats an ISO date string (e.g. "2026-08-04") or date object into a human-readable date.
 * Example: "2026-08-04" -> "Aug 4, 2026"
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return "—";
  if (dateString.includes("Awaiting") || dateString.includes("Pending") || dateString === "—") {
    return dateString;
  }
  
  try {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      
      const date = new Date(year, monthIndex, day);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    }

    const fallbackDate = new Date(dateString);
    if (!isNaN(fallbackDate.getTime())) {
      return fallbackDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  } catch (e) {
    // If parsing fails, return raw string
  }

  return dateString;
}
