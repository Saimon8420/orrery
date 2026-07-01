import {
  AngleFromSun, Constellation, Illumination, Horizon, MoonPhase, Observer,
} from "astronomy-engine";
import type { BodyKey } from "./bodies";
import { phaseLabel, phaseName, toAstroBody } from "./bodies";
import { geoEcliptic, equatorialOfDate, equatorialJ2000 } from "./ephemeris";
import { round } from "./format";

export interface Position {
  body: BodyKey;
  eclipticLongitude: number;
  eclipticLatitude: number;
  rightAscension: number;
  declination: number;
  distanceAu: number;
  constellation: string;
  angularDiameterDeg: number;
  elongationDeg: number;
  magnitude: number | null;
  illuminatedFraction: number;
  phase: string;
  altitude?: number;
  azimuth?: number;
  aboveHorizon?: boolean;
}

export function computePosition(key: BodyKey, date: Date, observer?: Observer): Position {
  const ecl = geoEcliptic(key, date);
  const eq = equatorialOfDate(key, date, observer);
  const j2000 = equatorialJ2000(key, date);
  const con = Constellation(j2000.raHours, j2000.dec);

  let magnitude: number | null = null;
  let illum = 1;
  let phase = "";
  if (key !== "sun") {
    const info = Illumination(toAstroBody(key), date);
    magnitude = round(info.mag, 2);
    illum = info.phase_fraction;
    phase = computePhase(key, date, illum);
  }
  // angular diameter: 2 * atan(radius / distance), using each body's mean radius.
  const angularDiameterDeg = round(angularDiameter(key, eq.distAu), 5);

  const elongationDeg = key === "sun" ? 0 : AngleFromSun(toAstroBody(key), date);

  const pos: Position = {
    body: key,
    eclipticLongitude: round(ecl.lon, 4),
    eclipticLatitude: round(ecl.lat, 4),
    rightAscension: round(eq.ra, 4),
    declination: round(eq.dec, 4),
    distanceAu: round(eq.distAu, 6),
    constellation: con.name,
    angularDiameterDeg,
    elongationDeg: round(elongationDeg, 3),
    magnitude,
    illuminatedFraction: round(illum, 4),
    phase,
  };

  if (observer) {
    const hor = Horizon(date, observer, eq.ra / 15, eq.dec, "normal");
    pos.altitude = round(hor.altitude, 3);
    pos.azimuth = round(hor.azimuth, 3);
    pos.aboveHorizon = hor.altitude > 0;
  }
  return pos;
}

function moonPhaseAngle(date: Date): number {
  return MoonPhase(date); // 0=new, 90=first quarter, 180=full, 270=last
}

/**
 * Phase name as seen from Earth. The Moon uses its canonical longitude-based
 * lunar phase. Every other body is labelled from its illuminated fraction, with
 * waxing/waning taken from whether that fraction is larger one hour later — a
 * geometry-agnostic test that is correct for inner planets (which wane as
 * evening stars) and outer planets (which stay near-full) alike.
 */
function computePhase(key: BodyKey, date: Date, illum: number): string {
  if (key === "moon") return phaseLabel(moonPhaseAngle(date));
  const later = Illumination(toAstroBody(key), new Date(date.getTime() + 3600000)).phase_fraction;
  return phaseName(illum, later > illum);
}

// Mean equatorial radii in km (for angular diameter). AU = 149597870.7 km.
const RADII_KM: Record<BodyKey, number> = {
  sun: 695700, moon: 1737.4, mercury: 2439.7, venus: 6051.8, mars: 3389.5,
  jupiter: 69911, saturn: 58232, uranus: 25362, neptune: 24622, pluto: 1188.3,
};
function angularDiameter(key: BodyKey, distAu: number): number {
  const distKm = distAu * 149597870.7;
  return 2 * Math.atan(RADII_KM[key] / distKm) * (180 / Math.PI);
}
