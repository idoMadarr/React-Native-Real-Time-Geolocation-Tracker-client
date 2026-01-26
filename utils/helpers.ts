export const setDelay = (time: number): Promise<void> =>
  new Promise(resolve => setTimeout(() => resolve(), time));

// If points.length <= 200 → return original points
// If points.length > 200 → return a sampled version for better performance
export const samplePoints = <T>(points: T[], maxPoints = 200): T[] => {
  if (points.length <= maxPoints) {
    return points;
  }

  const sampled: T[] = [];
  const step = (points.length - 1) / (maxPoints - 1);

  for (let i = 0; i < maxPoints; i++) {
    const index = Math.round(i * step);
    sampled.push(points[index]);
  }

  return sampled;
};
