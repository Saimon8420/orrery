import { Seasons } from "astronomy-engine";

export interface SeasonSet {
  year: number;
  marchEquinox: string;
  juneSolstice: string;
  septemberEquinox: string;
  decemberSolstice: string;
}

export function computeSeasons(year: number): SeasonSet {
  const s = Seasons(year);
  return {
    year,
    marchEquinox: s.mar_equinox.date.toISOString(),
    juneSolstice: s.jun_solstice.date.toISOString(),
    septemberEquinox: s.sep_equinox.date.toISOString(),
    decemberSolstice: s.dec_solstice.date.toISOString(),
  };
}
