/**
 * Official MTA route-bullet colours. These are the real ones — the
 * palette is doing double duty as the site's accent system, so it is
 * worth getting exactly right.
 * Reference: MTA Standards Manual route bullet specifications.
 */
export type Route =
  | "1" | "2" | "3"
  | "4" | "5" | "6"
  | "7"
  | "A" | "C" | "E"
  | "B" | "D" | "F" | "M"
  | "N" | "Q" | "R" | "W"
  | "G"
  | "J" | "Z"
  | "L"
  | "S";

const RED = "#EE352E";
const GREEN = "#00933C";
const PURPLE = "#B933AD";
const BLUE = "#0039A6";
const ORANGE = "#FF6319";
const YELLOW = "#FCCC0A";
const LIME = "#6CBE45";
const BROWN = "#996633";
const GREY = "#A7A9AC";
const SHUTTLE = "#808183";

export const routeColors: Record<Route, string> = {
  "1": RED, "2": RED, "3": RED,
  "4": GREEN, "5": GREEN, "6": GREEN,
  "7": PURPLE,
  A: BLUE, C: BLUE, E: BLUE,
  B: ORANGE, D: ORANGE, F: ORANGE, M: ORANGE,
  N: YELLOW, Q: YELLOW, R: YELLOW, W: YELLOW,
  G: LIME,
  J: BROWN, Z: BROWN,
  L: GREY,
  S: SHUTTLE,
};

/** The yellow bullets carry black text; everything else is white.
 *  Getting this backwards is the classic giveaway of a fake bullet. */
export function routeTextColor(route: Route) {
  return routeColors[route] === YELLOW ? "#000000" : "#FFFFFF";
}

/** R211-ish rolling stock. Stainless body, navy band, black window mask. */
export const car = {
  shell: "#dfe4ea",
  shellDark: "#b3bac2",
  band: "#0039A6",
  roof: "#a9b0b8",
  skirt: "#41474e",
  door: "#eef1f4",
  glass: "#1d2630",
  glassLit: "#ffd9a0",
  truck: "#2b2f35",
  wheel: "#1b1e22",
};

/** Elevated structure — the green-grey of the 7 line viaduct. */
export const structure = {
  steel: "#6f7d72",
  steelDark: "#536057",
  rail: "#9aa4b0",
  tie: "#6b5545",
  thirdRail: "#2e2e2e",
  thirdRailCover: "#d8d2c4",
};

export const cityGround = {
  near: "#8d9aa6",
  far: "#9fb0bd",
  street: "#5c646d",
};
