/** Same clock the store prints under the nav: M.D.YY h:mm AM/PM */
export function formatBlondedTime(date: Date): string {
  const year = date.getFullYear().toString().slice(2);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const hour12 = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : String(date.getMinutes());
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${month}.${day}.${year} ${hour12}:${minutes} ${suffix}`;
}
