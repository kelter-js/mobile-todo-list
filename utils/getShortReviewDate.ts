const LONG_DATE_OPTIONS = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const getShortReviewDate = (date: Date) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const taskDate = new Date(date.getTime()).setHours(0, 0, 0, 0);

  if (today === taskDate) {
    return `Today ${date.getHours()}:${date.getMinutes()}`;
  }

  return date.toLocaleDateString(
    "ru-RU",
    LONG_DATE_OPTIONS as Intl.DateTimeFormatOptions
  );
};
