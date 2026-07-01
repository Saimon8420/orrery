import { Body, Observer, SearchAltitude } from "astronomy-engine";

export interface TwilightPair { dawn: string | null; dusk: string | null; }
export interface TwilightDay {
  date: string;
  civil: TwilightPair;
  nautical: TwilightPair;
  astronomical: TwilightPair;
  goldenHour: TwilightPair;
}

function pair(observer: Observer, dayStart: Date, altitude: number): TwilightPair {
  // +1 = Sun ascending through the altitude (dawn), -1 = descending (dusk)
  const dawn = SearchAltitude(Body.Sun, observer, +1, dayStart, 1, altitude);
  const dusk = SearchAltitude(Body.Sun, observer, -1, dayStart, 1, altitude);
  return {
    dawn: dawn ? dawn.date.toISOString() : null,
    dusk: dusk ? dusk.date.toISOString() : null,
  };
}

export function computeTwilight(observer: Observer, dayStart: Date): TwilightDay {
  return {
    date: dayStart.toISOString().slice(0, 10),
    civil: pair(observer, dayStart, -6),
    nautical: pair(observer, dayStart, -12),
    astronomical: pair(observer, dayStart, -18),
    goldenHour: pair(observer, dayStart, 6),
  };
}
