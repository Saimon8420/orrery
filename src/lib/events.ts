import {
  PairLongitude, SearchRelativeLongitude, SearchMaxElongation,
} from "astronomy-engine";
import type { BodyKey } from "./bodies";
import { toAstroBody } from "./bodies";
import { round } from "./format";

export interface SkyEvent {
  type: "conjunction" | "opposition";
  bodies: string[];
  datetime: string;
  separationDeg: number;
}

const OUTER: BodyKey[] = ["mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];
const INNER: BodyKey[] = ["mercury", "venus"];

/** Oppositions of the outer planets + inferior conjunctions of the inner planets, vs the Sun. */
export function sunRelativeEvents(from: Date, to: Date): SkyEvent[] {
  const events: SkyEvent[] = [];
  const pushSeries = (key: BodyKey, targetRelLon: number, type: SkyEvent["type"]) => {
    let t = from;
    for (let i = 0; i < 200; i++) {
      const when = SearchRelativeLongitude(toAstroBody(key), targetRelLon, t);
      if (!when || when.date > to) break;
      events.push({ type, bodies: [key, "sun"], datetime: when.date.toISOString(), separationDeg: type === "opposition" ? 180 : 0 });
      t = new Date(when.date.getTime() + 15 * 86400000); // step past this event
    }
  };
  // NOTE: SearchRelativeLongitude's targetRelLon is the heliocentric longitude
  // difference (Earth - body, direction-adjusted), NOT the geocentric Sun-body
  // separation. For outer planets, opposition (Earth between Sun and planet)
  // occurs at relative longitude 0 (verified against the real 2025-01-16 Mars
  // opposition: SearchRelativeLongitude(Mars, 0, ...) => 2025-01-16, while
  // targetRelLon=180 yields a different, unrelated (superior-conjunction-like)
  // date). Inferior conjunction of an inner planet is likewise at relative
  // longitude 0 (verified against Venus's ~2025-03-23 inferior conjunction).
  for (const key of OUTER) pushSeries(key, 0, "opposition");
  for (const key of INNER) pushSeries(key, 0, "conjunction"); // inferior conjunction
  return events.sort((a, b) => a.datetime.localeCompare(b.datetime));
}

/** Planet–planet longitude conjunctions via daily PairLongitude zero-crossing + bisection. */
export function planetPairConjunctions(from: Date, to: Date): SkyEvent[] {
  const planets: BodyKey[] = ["mercury", "venus", "mars", "jupiter", "saturn"];
  const events: SkyEvent[] = [];
  const diff = (a: BodyKey, b: BodyKey, d: Date) => {
    // signed shortest angular difference of (a - b) longitudes, in [-180,180]
    let x = PairLongitude(toAstroBody(a), toAstroBody(b), d);
    if (x > 180) x -= 360;
    return x;
  };
  const dayMs = 86400000;
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const a = planets[i], b = planets[j];
      let prev = diff(a, b, from);
      for (let t = from.getTime() + dayMs; t <= to.getTime(); t += dayMs) {
        const cur = diff(a, b, new Date(t));
        // zero crossing not spanning the ±180 wrap
        if (prev === 0 || (prev < 0 !== cur < 0 && Math.abs(prev) < 90 && Math.abs(cur) < 90)) {
          // bisect between t-day and t
          let lo = t - dayMs, hi = t;
          for (let k = 0; k < 40; k++) {
            const mid = (lo + hi) / 2;
            const dm = diff(a, b, new Date(mid));
            if ((diff(a, b, new Date(lo)) < 0) !== (dm < 0)) hi = mid; else lo = mid;
          }
          const when = new Date((lo + hi) / 2);
          // separation in ecliptic longitude (latitude ignored) ≈ 0; report actual longitude gap
          events.push({ type: "conjunction", bodies: [a, b], datetime: when.toISOString(), separationDeg: round(Math.abs(diff(a, b, when)), 3) });
        }
        prev = cur;
      }
    }
  }
  return events.sort((x, y) => x.datetime.localeCompare(y.datetime));
}

export interface ElongationEventOut {
  body: string;
  datetime: string;
  maxElongationDeg: number;
  direction: "morning" | "evening";
}

export function greatestElongations(from: Date, count: number): ElongationEventOut[] {
  const out: ElongationEventOut[] = [];
  for (const key of INNER) {
    let t = from;
    for (let i = 0; i < count; i++) {
      const e = SearchMaxElongation(toAstroBody(key), t);
      out.push({
        body: key,
        datetime: e.time.date.toISOString(),
        maxElongationDeg: round(e.elongation, 3),
        direction: e.visibility === "morning" ? "morning" : "evening",
      });
      t = new Date(e.time.date.getTime() + 20 * 86400000);
    }
  }
  return out.sort((a, b) => a.datetime.localeCompare(b.datetime));
}
