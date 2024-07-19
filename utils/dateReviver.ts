const dateReviver = (_: string, value: string) => {
  if (
    "string" === typeof value &&
    /^\d{4}-[01]\d-[0-3]\dT[012]\d(?::[0-6]\d){2}\.\d{3}Z$/.test(value)
  ) {
    const date = new Date(value);

    if (+date === +date) {
      return date;
    }
  }

  return value;
};

export default dateReviver;
