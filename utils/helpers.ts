export const setDelay = (time: number): Promise<void> =>
  new Promise(resolve => setTimeout(() => resolve(), time));
