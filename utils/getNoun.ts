export const getNoun = (number: number, words: string[]): string => {
  const mod100 = number % 100;

  const mod10 = number % 10;

  if (mod100 >= 11 && mod100 <= 19) {
    return words[2];
  }

  switch (mod10) {
    case 1:
      return words[0];
    case 2:
    case 3:
    case 4:
      return words[1];
    default:
      return words[2];
  }
};
