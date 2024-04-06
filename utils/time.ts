export const getTimestamp = () => {
  let time = Date.parse(new Date().toUTCString());

  return time / 1000;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
