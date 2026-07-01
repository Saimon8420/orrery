import {
  Observer,
  SearchLunarEclipse, NextLunarEclipse,
  SearchGlobalSolarEclipse, NextGlobalSolarEclipse,
  SearchLocalSolarEclipse, NextLocalSolarEclipse,
  type EclipseEvent, type EclipseKind,
} from "astronomy-engine";
import { round } from "./format";

const kindStr = (k: EclipseKind): string => String(k);

export interface SolarGlobalEclipse {
  kind: string; peak: string; obscuration: number | null;
  greatestEclipse: { lat: number; lon: number } | null;
}

export function nextSolarGlobal(from: Date, count: number): SolarGlobalEclipse[] {
  const out: SolarGlobalEclipse[] = [];
  let e = SearchGlobalSolarEclipse(from);
  for (let i = 0; i < count; i++) {
    out.push({
      kind: kindStr(e.kind),
      peak: e.peak.date.toISOString(),
      obscuration: e.obscuration ?? null,
      greatestEclipse:
        e.latitude !== undefined && e.longitude !== undefined
          ? { lat: round(e.latitude, 4), lon: round(e.longitude, 4) }
          : null,
    });
    e = NextGlobalSolarEclipse(e.peak);
  }
  return out;
}

export interface LunarEclipse {
  kind: string; peak: string; obscuration: number | null;
  partialBegin: string | null; partialEnd: string | null;
  totalBegin: string | null; totalEnd: string | null;
}

export function nextLunar(from: Date, count: number): LunarEclipse[] {
  const out: LunarEclipse[] = [];
  let e = SearchLunarEclipse(from);
  for (let i = 0; i < count; i++) {
    const peakMs = e.peak.date.getTime();
    const off = (min: number) => new Date(peakMs + min * 60000).toISOString();
    const hasPartial = e.sd_partial > 0;
    const hasTotal = e.sd_total > 0;
    out.push({
      kind: kindStr(e.kind),
      peak: e.peak.date.toISOString(),
      obscuration: e.obscuration ?? null,
      partialBegin: hasPartial ? off(-e.sd_partial) : null,
      partialEnd: hasPartial ? off(e.sd_partial) : null,
      totalBegin: hasTotal ? off(-e.sd_total) : null,
      totalEnd: hasTotal ? off(e.sd_total) : null,
    });
    e = NextLunarEclipse(e.peak);
  }
  return out;
}

export interface LocalSolarEclipse {
  kind: string;
  partialBegin: { time: string; altitude: number } | null;
  totalBegin: { time: string; altitude: number } | null;
  peak: { time: string; altitude: number };
  totalEnd: { time: string; altitude: number } | null;
  partialEnd: { time: string; altitude: number } | null;
  obscuration: number | null;
}

const ev = (e: EclipseEvent | undefined): { time: string; altitude: number } | null =>
  e ? { time: e.time.date.toISOString(), altitude: round(e.altitude, 3) } : null;

export function solarLocal(from: Date, observer: Observer, count: number): LocalSolarEclipse[] {
  const out: LocalSolarEclipse[] = [];
  let e = SearchLocalSolarEclipse(from, observer);
  for (let i = 0; i < count; i++) {
    out.push({
      kind: kindStr(e.kind),
      partialBegin: ev(e.partial_begin),
      totalBegin: ev(e.total_begin),
      peak: ev(e.peak)!,
      totalEnd: ev(e.total_end),
      partialEnd: ev(e.partial_end),
      obscuration: e.obscuration ?? null,
    });
    e = NextLocalSolarEclipse(e.peak.time, observer);
  }
  return out;
}
