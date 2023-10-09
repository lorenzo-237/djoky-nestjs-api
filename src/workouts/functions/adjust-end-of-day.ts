export default function adjustEndOfDay(endDate: Date): Date {
  if (!(endDate instanceof Date)) {
    throw new Error('endDate must be an instance of Date.');
  }

  // Get the date part from endDate
  const date = new Date(endDate);

  // Set the hours, minutes, seconds, and milliseconds to the end of the day
  date.setUTCHours(23, 59, 59, 999);

  return date;
}
