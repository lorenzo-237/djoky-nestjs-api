export default function parsePositiveNonNullInt(
  s: string,
  defaultValue: number,
): number {
  return isNaN(parseInt(s)) || parseInt(s) <= 0 ? defaultValue : parseInt(s);
}
