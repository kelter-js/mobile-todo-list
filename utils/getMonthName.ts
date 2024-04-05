const getMonthName = (date: Date): string => {
  const month = date.toLocaleString("ru-RU", { month: "long" });

  return month.slice(0, 1).toUpperCase() + month.slice(1);
};

export default getMonthName;
