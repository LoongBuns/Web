export function convertCustomTimestamp(arr) {
  if (!Array.isArray(arr) || arr.length < 6) return null;

  const [year, dayOfYear, hour, minute, second, microsecond] = arr;

  const date = new Date(Date.UTC(year, 0));
  date.setUTCDate(dayOfYear);
  date.setUTCHours(hour, minute, second, Math.floor(microsecond / 1000));

  return date;
}

export function formatDate(raw) {
  if (!raw) return "N/A";

  if (Array.isArray(raw)) {
    const date = convertCustomTimestamp(raw);
    return date && !isNaN(date.getTime()) ? date.toLocaleString() : "N/A";
  }

  if (typeof raw === "string") {
    const normalized = raw.includes("T") ? raw : raw.replace(" ", "T");
    const date = new Date(normalized);
    return !isNaN(date.getTime()) ? date.toLocaleString() : "N/A";
  }

  if (typeof raw === "object" && raw.seconds) {
    const date = new Date(raw.seconds * 1000);
    return !isNaN(date.getTime()) ? date.toLocaleString() : "N/A";
  }

  const date = new Date(raw);
  return !isNaN(date.getTime()) ? date.toLocaleString() : "N/A";
}
