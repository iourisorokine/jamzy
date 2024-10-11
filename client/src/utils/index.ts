export const getTimeout = (tempo: number) => {
  return (60 / tempo / 2) * 1000;
};
