const ramadanStartDate = '2026-02-19';
const start = new Date(ramadanStartDate);
const today = new Date('2026-02-21T08:02:11+05:30'); // Simulating today's date
start.setHours(0, 0, 0, 0);
today.setHours(0, 0, 0, 0);
const diffTime = today.getTime() - start.getTime();
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
const newDay = Math.min(30, Math.max(1, diffDays + 1));

console.log({
  start: start.toString(),
  today: today.toString(),
  diffTime,
  diffDays,
  newDay
});
