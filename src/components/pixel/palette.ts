/**
 * A deliberately small palette. Pixel art reads as "refined" mostly
 * because of restraint: few colours, one light direction (top-left),
 * and every shape carrying a darker edge on its shadow side.
 */
export const P = {
  // sky, morning → golden hour
  skyTop: "#5AB3E0",
  skyMid: "#93D3EC",
  skyLow: "#CFEBF2",
  skyHaze: "#FBECC4",
  sun: "#FFEFB8",
  sunCore: "#FFF8DC",

  cloud: "#FFFFFF",
  cloudMid: "#E4EEF5",
  cloudShade: "#C2D6E4",

  // distant skyline
  farA: "#8FA7C0",
  farB: "#7D95B0",
  farC: "#9DB3C9",
  farWindow: "#6E87A3",

  // brownstones
  brickLo: "#7E3F30",
  brick: "#A0563F",
  brickHi: "#BE7355",
  stone: "#C9BBA0",
  stoneLo: "#A3957C",
  cornice: "#6B5545",

  roof: "#3F4A5C",
  roofHi: "#55637A",

  glass: "#35536E",
  glassLit: "#F5CE7E",
  glassHi: "#5C7F9C",

  // greenery
  leafHi: "#6FAE55",
  leaf: "#4E8B45",
  leafLo: "#35652F",
  trunk: "#6B4A32",

  // the elevated structure
  steel: "#5E7A66",
  steelHi: "#75917C",
  steelLo: "#3F5747",
  rail: "#C0C8D0",
  tie: "#6A5140",

  // rolling stock
  carHi: "#E6EBF0",
  car: "#C8D0D8",
  carLo: "#98A2AC",
  carEdge: "#6E7883",
  skirt: "#454D57",
  truck: "#2F353D",
  wheel: "#1E2228",

  // street
  street: "#565E68",
  streetLine: "#C8B96B",
  walk: "#A7A596",
  walkLo: "#8B897C",

  ink: "#242830",
  white: "#FFFFFF",
} as const;

export type PixelColor = string;
