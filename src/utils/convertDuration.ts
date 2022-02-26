export const convertDurationMs = (duration_ms: number) => {
  const seconds = Math.floor((duration_ms / 1000) % 60)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((duration_ms / (1000 * 60)) % 60)
    .toString()
    .padStart(2, '0');
  const hours = Math.floor((duration_ms / (1000 * 60 * 60)) % 24);

  return hours > 0
    ? `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`
    : `${minutes}:${seconds}`;
};
