import type { BodyRef, BodyKey } from "../bodies";

export const BODY_DATA: Record<BodyKey, Omit<BodyRef, "key">> = {
  sun:     { name: "Sun",     type: "star",   symbol: "☉", keynote: "The star at the centre of our system." },
  moon:    { name: "Moon",    type: "moon",   symbol: "☽", keynote: "Earth's only natural satellite." },
  mercury: { name: "Mercury", type: "planet", symbol: "☿", keynote: "Swiftest planet, never far from the Sun." },
  venus:   { name: "Venus",   type: "planet", symbol: "♀", keynote: "The brilliant morning and evening star." },
  mars:    { name: "Mars",    type: "planet", symbol: "♂", keynote: "The red planet." },
  jupiter: { name: "Jupiter", type: "planet", symbol: "♃", keynote: "Largest planet, ruler of the giants." },
  saturn:  { name: "Saturn",  type: "planet", symbol: "♄", keynote: "The ringed gas giant." },
  uranus:  { name: "Uranus",  type: "planet", symbol: "♅", keynote: "Ice giant tipped on its side." },
  neptune: { name: "Neptune", type: "planet", symbol: "♆", keynote: "The distant blue ice giant." },
  pluto:   { name: "Pluto",   type: "dwarf",  symbol: "♇", keynote: "The archetypal dwarf planet." },
};
