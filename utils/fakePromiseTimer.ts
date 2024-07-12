const fakePromiseTimer = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, delay);
  });
};

export default fakePromiseTimer;
