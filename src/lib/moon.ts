import {
  Body, Illumination, Libration, MoonPhase, Observer,
  SearchMoonQuarter, NextMoonQuarter, EclipticGeoMoon,
} from "astronomy-engine";
import { phaseLabel } from "./bodies";
import { computeRiseSet } from "./riseset";
import { round } from "./format";

const QUARTER_NAMES = ["New Moon", "First Quarter", "Full Moon", "Last Quarter"];

export interface MoonInfo {
  datetime: string;
  phase: string;
  phaseAngle: number;
  illuminatedFraction: number;
  ageDays: number;
  distanceKm: number;
  angularDiameterDeg: number;
  libration: { latitude: number; longitude: number };
  rise?: string | null;
  set?: string | null;
}

export function computeMoon(date: Date, observer?: Observer): MoonInfo {
  const angle = MoonPhase(date);
  const info = Illumination(Body.Moon, date);
  const lib = Libration(date);
  const ecl = EclipticGeoMoon(date); // has dist (AU)
  const distKm = ecl.dist * 149597870.7;

  const out: MoonInfo = {
    datetime: date.toISOString(),
    phase: phaseLabel(angle),
    phaseAngle: round(angle, 3),
    illuminatedFraction: round(info.phase_fraction, 4),
    ageDays: round((angle / 360) * 29.530588853, 2),
    distanceKm: round(distKm, 1),
    angularDiameterDeg: round(lib.diam_deg, 5),
    libration: { latitude: round(lib.elat, 3), longitude: round(lib.elon, 3) },
  };
  if (observer) {
    const dayStart = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const rs = computeRiseSet("moon", observer, dayStart);
    out.rise = rs.rise;
    out.set = rs.set;
  }
  return out;
}

export interface MoonPhaseEvent { phase: string; datetime: string; }

export function upcomingPhases(from: Date, count: number): MoonPhaseEvent[] {
  const events: MoonPhaseEvent[] = [];
  let mq = SearchMoonQuarter(from);
  for (let i = 0; i < count; i++) {
    events.push({ phase: QUARTER_NAMES[mq.quarter], datetime: mq.time.date.toISOString() });
    mq = NextMoonQuarter(mq);
  }
  return events;
}
