export const getPercentageDiffBetweenDates = (
  creationDate: Date,
  desiredDate: Date
) => {
  const diff = Math.ceil(
    ((new Date().getTime() - creationDate.getTime()) /
      (desiredDate.getTime() - creationDate.getTime())) *
      100
  );

  if (diff > 100) {
    return 100;
  }

  return diff;
};
