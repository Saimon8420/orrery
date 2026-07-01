import {
  SearchRiseSet, SearchHourAngle, Observer, Horizon, Equator,
} from "astronomy-engine";
import type { BodyKey } from "./bodies";
import { toAstroBody } from "./bodies";
import { round } from "./format";

export interface RiseSetDay {
  body: BodyKey;
  date: string;
  rise: string | null;
  set: string | null;
  transit: string | null;
  transitAltitude: number | null;
  status: "normal" | "alwaysUp" | "alwaysDown";
}

export function computeRiseSet(key: BodyKey, observer: Observer, dayStart: Date): RiseSetDay {
  const body = toAstroBody(key);
  const rise = SearchRiseSet(body, observer, +1, dayStart, 1);
  const set = SearchRiseSet(body, observer, -1, dayStart, 1);
  let transit: string | null = null;
  let transitAltitude: number | null = null;
  try {
    const culm = SearchHourAngle(body, observer, 0, dayStart, +1);
    transit = culm.time.date.toISOString();
    transitAltitude = round(culm.hor.altitude, 3);
  } catch {
    /* leave null */
  }

  let status: RiseSetDay["status"] = "normal";
  if (!rise && !set) {
    // Determine circumpolar direction from current altitude at transit (or midday).
    const eq = Equator(body, dayStart, observer, true, true);
    const hor = Horizon(dayStart, observer, eq.ra, eq.dec, "normal");
    status = hor.altitude > 0 ? "alwaysUp" : "alwaysDown";
  }

  return {
    body: key,
    date: dayStart.toISOString().slice(0, 10),
    rise: rise ? rise.date.toISOString() : null,
    set: set ? set.date.toISOString() : null,
    transit,
    transitAltitude,
    status,
  };
}
