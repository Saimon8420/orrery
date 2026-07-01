import { Body } from "astronomy-engine";
import { ApiError } from "../middleware/errorHandler";
import { BODY_DATA } from "./data/bodies";

export type BodyKey =
  | "sun" | "moon" | "mercury" | "venus" | "mars"
  | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto";

export interface BodyRef {
  key: BodyKey;
  name: string;
  type: "star" | "planet" | "moon" | "dwarf";
  symbol: string;
  keynote: string;
}

export const BODY_KEYS = Object.keys(BODY_DATA) as BodyKey[];

export const BODY_REFS: Record<BodyKey, BodyRef> = Object.fromEntries(
  BODY_KEYS.map((k) => [k, { key: k, ...BODY_DATA[k] }]),
) as Record<BodyKey, BodyRef>;

const ASTRO: Record<BodyKey, Body> = {
  sun: Body.Sun, moon: Body.Moon, mercury: Body.Mercury, venus: Body.Venus,
  mars: Body.Mars, jupiter: Body.Jupiter, saturn: Body.Saturn,
  uranus: Body.Uranus, neptune: Body.Neptune, pluto: Body.Pluto,
};

export const toAstroBody = (key: BodyKey): Body => ASTRO[key];

export function assertBody(s: string): BodyKey {
  const k = s.toLowerCase() as BodyKey;
  if (!BODY_KEYS.includes(k)) {
    throw new ApiError("UNKNOWN_BODY", `Unknown body '${s}'`, 400, { validBodies: BODY_KEYS });
  }
  return k;
}

/** Map a Sun-relative phase angle (deg, 0=new..180=full for the Moon convention) to a label. */
export function phaseLabel(phaseAngleDeg: number): string {
  const a = ((phaseAngleDeg % 360) + 360) % 360;
  if (a < 22.5 || a >= 337.5) return "New";
  if (a < 67.5) return "Waxing Crescent";
  if (a < 112.5) return "First Quarter";
  if (a < 157.5) return "Waxing Gibbous";
  if (a < 202.5) return "Full";
  if (a < 247.5) return "Waning Gibbous";
  if (a < 292.5) return "Last Quarter";
  return "Waning Crescent";
}

/**
 * Phase name from a body's illuminated fraction (0..1) as seen from Earth,
 * with waxing/waning supplied by the caller (illuminated fraction increasing =
 * waxing). Used for the planets — Mercury and Venus show real crescent→gibbous
 * phases, the outer planets stay near-full. "New" and "Full" take no prefix.
 */
export function phaseName(illuminatedFraction: number, waxing: boolean): string {
  const f = illuminatedFraction;
  if (f >= 0.996) return "Full";
  if (f <= 0.004) return "New";
  if (f <= 0.46) return waxing ? "Waxing Crescent" : "Waning Crescent";
  if (f < 0.54) return waxing ? "First Quarter" : "Last Quarter";
  return waxing ? "Waxing Gibbous" : "Waning Gibbous";
}
