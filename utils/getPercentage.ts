export const getPercentage = (percent: number, total: number): number =>
  +((percent / 100) * total).toFixed(2);
