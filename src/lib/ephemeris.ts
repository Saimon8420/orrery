import {
  Body, Ecliptic, EclipticGeoMoon, Equator, GeoVector, Observer,
  Rotation_EQJ_ECT, RotateVector, SunPosition,
} from "astronomy-engine";
import type { BodyKey } from "./bodies";
import { toAstroBody } from "./bodies";

/** Geocentric tropical ecliptic-of-date longitude/latitude (deg). */
export function geoEcliptic(key: BodyKey, date: Date): { lon: number; lat: number } {
  if (key === "sun") {
    const s = SunPosition(date);      // ecliptic-of-date geocentric
    return { lon: s.elon, lat: s.elat };
  }
  if (key === "moon") {
    const m = EclipticGeoMoon(date);  // true ecliptic of date
    return { lon: m.lon, lat: m.lat };
  }
  const eqj = GeoVector(toAstroBody(key), date, true);       // EQJ, aberration-corrected
  const ect = RotateVector(Rotation_EQJ_ECT(date), eqj);     // → ecliptic true-of-date
  const ecl = Ecliptic(ect);
  return { lon: ecl.elon, lat: ecl.elat };
}

/** Equatorial of-date; ra returned in DEGREES (0..360). Topocentric if observer given. */
export function equatorialOfDate(
  key: BodyKey,
  date: Date,
  observer?: Observer,
): { ra: number; dec: number; distAu: number } {
  const eq = Equator(toAstroBody(key), date, observer ?? new Observer(0, 0, 0), true, true);
  return { ra: eq.ra * 15, dec: eq.dec, distAu: eq.dist };
}

/** Equatorial J2000 (for constellation lookup). ra in HOURS (as the engine wants). */
export function equatorialJ2000(key: BodyKey, date: Date): { raHours: number; dec: number } {
  const eq = Equator(toAstroBody(key), date, new Observer(0, 0, 0), false, true);
  return { raHours: eq.ra, dec: eq.dec };
}

export function makeObserver(lat: number, lon: number, elevation = 0): Observer {
  return new Observer(lat, lon, elevation);
}
export { Body };
