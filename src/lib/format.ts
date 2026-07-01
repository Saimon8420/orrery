export const round = (n: number, dp = 4): number =>
  Number.isFinite(n) ? Number(n.toFixed(dp)) : n;

export const ok = <T>(data: T) => ({ data });
