// eslint-disable-next-line no-unused-vars
function toOffsetDateTime(localTimeStr) {
  if (!localTimeStr) return undefined;
  const date = new Date(localTimeStr);
  if (isNaN(date)) return undefined;

  const year = date.getFullYear();
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const dayOfYear =
    Math.floor(
      (date -
        startOfYear +
        (startOfYear.getTimezoneOffset() - date.getTimezoneOffset()) * 60000) /
        86400000
    ) + 1;

  return [
    year,
    dayOfYear,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds() * 1000,
    0,
    0,
    0,
  ];
}
