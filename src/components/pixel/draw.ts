import { P } from "./palette";

export type Ctx = CanvasRenderingContext2D;

/* ── primitives ─────────────────────────────────────────────── */

/** A rectangle snapped to the pixel grid. Everything goes through this. */
export function px(c: Ctx, x: number, y: number, w: number, h: number, col: string) {
  if (w <= 0 || h <= 0) return;
  c.fillStyle = col;
  c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

/**
 * Checkerboard dither between two colours. Pixel art blends by
 * interleaving pixels, not by alpha — this is what keeps gradients
 * from looking like a blurred photo.
 */
export function dither(
  c: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  col: string,
  step = 2,
  offset = 0,
) {
  const x0 = Math.round(x);
  const y0 = Math.round(y);
  c.fillStyle = col;
  for (let j = 0; j < Math.round(h); j++) {
    for (let i = (j + offset) % step; i < Math.round(w); i += step) {
      c.fillRect(x0 + i, y0 + j, 1, 1);
    }
  }
}

/** Linear blend of two hex colours. */
export function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const r = Math.round((((pa >> 16) & 255) * (1 - t)) + ((pb >> 16) & 255) * t);
  const g = Math.round((((pa >> 8) & 255) * (1 - t)) + ((pb >> 8) & 255) * t);
  const bl = Math.round(((pa & 255) * (1 - t)) + (pb & 255) * t);
  return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, "0")}`;
}

/** Sample a multi-stop colour ramp at t in 0..1. */
function ramp(stops: { at: number; col: string }[], t: number) {
  if (t <= stops[0].at) return stops[0].col;
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i].at) {
      const span = stops[i].at - stops[i - 1].at || 1;
      return mix(stops[i - 1].col, stops[i].col, (t - stops[i - 1].at) / span);
    }
  }
  return stops[stops.length - 1].col;
}

/**
 * A pixel-art sky: quantised into a fixed number of flat bands, with a
 * two-row dither at each boundary. Quantising first (rather than
 * dithering a smooth gradient) is what makes it read as deliberate art
 * instead of a compression artefact.
 */
export function skyBands(
  c: Ctx,
  w: number,
  h: number,
  stops: { at: number; col: string }[],
  bands = 14,
) {
  const edges: number[] = [];
  const cols: string[] = [];
  for (let i = 0; i < bands; i++) {
    edges.push(Math.round((i / bands) * h));
    cols.push(ramp(stops, (i + 0.5) / bands));
  }
  edges.push(h);

  for (let i = 0; i < bands; i++) {
    px(c, 0, edges[i], w, edges[i + 1] - edges[i], cols[i]);
  }
  // Two rows of dither at each boundary: the row above borrows the colour
  // below at 1-in-2, the row above that at 1-in-4.
  for (let i = 1; i < bands; i++) {
    const y = edges[i];
    dither(c, 0, y - 1, w, 1, cols[i], 2, 0);
    dither(c, 0, y - 2, w, 1, cols[i], 4, 0);
    dither(c, 0, y, w, 1, cols[i - 1], 3, 1);
  }
}

/** A block with a top-left highlight and a bottom-right shadow. */
export function panel(
  c: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  base: string,
  hi: string,
  lo: string,
) {
  px(c, x, y, w, h, base);
  px(c, x, y, w, 1, hi);
  px(c, x, y, 1, h, hi);
  px(c, x, y + h - 1, w, 1, lo);
  px(c, x + w - 1, y, 1, h, lo);
}

/* ── city ───────────────────────────────────────────────────── */

/** Hazy tower on the horizon. Flat, few details — distance is depth. */
export function drawTower(
  c: Ctx,
  x: number,
  groundY: number,
  w: number,
  h: number,
  base: string,
  lit: number,
) {
  const y = groundY - h;
  px(c, x, y, w, h, base);
  px(c, x, y, w, 1, P.farC);
  px(c, x + w - 1, y, 1, h, P.farB);

  // Window grid, sparse and regular.
  for (let wy = y + 4; wy < groundY - 3; wy += 4) {
    for (let wx = x + 2; wx < x + w - 3; wx += 4) {
      const on = ((wx * 7 + wy * 13) % 11) / 11 < lit;
      px(c, wx, wy, 2, 2, on ? P.glassLit : P.farWindow);
    }
  }
}

/** Pre-war brownstone: cornice, window bays, stoop. */
export function drawBrownstone(
  c: Ctx,
  x: number,
  groundY: number,
  w: number,
  h: number,
  seed: number,
  lit: number,
) {
  const y = groundY - h;
  const warm = seed % 3;
  const base = warm === 0 ? P.brick : warm === 1 ? P.brickLo : "#8E4A38";

  panel(c, x, y, w, h, base, P.brickHi, P.brickLo);

  // Cornice along the roofline — the detail that makes it pre-war.
  px(c, x - 1, y - 3, w + 2, 3, P.cornice);
  px(c, x - 1, y - 3, w + 2, 1, P.stoneLo);
  for (let i = x; i < x + w; i += 4) px(c, i, y - 1, 2, 1, P.stoneLo);

  // Window bays.
  const cols = Math.max(1, Math.floor((w - 4) / 9));
  const gap = Math.floor((w - cols * 6) / (cols + 1));
  for (let row = 0; row < Math.floor((h - 8) / 12); row++) {
    const wy = y + 6 + row * 12;
    for (let i = 0; i < cols; i++) {
      const wx = x + gap + i * (6 + gap);
      px(c, wx - 1, wy - 1, 8, 10, P.stone);
      const on = ((wx * 5 + wy * 9 + seed) % 13) / 13 < lit;
      px(c, wx, wy, 6, 8, on ? P.glassLit : P.glass);
      px(c, wx, wy, 6, 1, P.glassHi);
      // Sill.
      px(c, wx - 1, wy + 9, 8, 1, P.stoneLo);
    }
  }

  // Stoop and door at street level.
  const dx = x + Math.floor(w / 2) - 3;
  px(c, dx, groundY - 11, 6, 11, P.cornice);
  px(c, dx + 1, groundY - 10, 4, 9, "#4E3A2C");
  px(c, dx - 2, groundY - 3, 10, 3, P.stone);
  px(c, dx - 2, groundY - 3, 10, 1, "#DCD2BC");
}

/** Rooftop water tower — the most New York object there is. */
export function drawWaterTower(c: Ctx, x: number, baseY: number) {
  // Legs
  px(c, x + 1, baseY - 5, 1, 5, P.cornice);
  px(c, x + 9, baseY - 5, 1, 5, P.cornice);
  // Tank
  panel(c, x, baseY - 17, 11, 12, "#8A6A4E", "#A98863", "#5E4632");
  // Staves
  for (let i = x + 1; i < x + 10; i += 3) px(c, i, baseY - 16, 1, 10, "#7A5C42");
  // Conical roof
  px(c, x - 1, baseY - 19, 13, 2, "#6B5040");
  px(c, x + 2, baseY - 21, 7, 2, "#6B5040");
  px(c, x + 4, baseY - 22, 3, 1, "#6B5040");
}

/* ── greenery and street ────────────────────────────────────── */

export function drawTree(c: Ctx, x: number, groundY: number, scale = 1) {
  const h = Math.round(14 * scale);
  px(c, x + 3, groundY - h, 3, h, P.trunk);
  px(c, x + 3, groundY - h, 1, h, "#835C40");
  const cy = groundY - h - Math.round(9 * scale);
  const r = Math.round(9 * scale);
  // Canopy built from stacked rows, widest in the middle.
  const rows = [2, 4, 6, 7, 7, 6, 4, 2];
  rows.forEach((wRow, i) => {
    const ww = Math.round((wRow / 7) * r * 2);
    const yy = cy + i * Math.max(1, Math.round(r / 4));
    px(c, x + 4 - ww / 2, yy, ww, Math.max(1, Math.round(r / 4)), P.leaf);
  });
  // Light from the top-left.
  px(c, x + 1, cy + 1, Math.round(r * 0.8), 2, P.leafHi);
  px(c, x, cy + Math.round(r * 0.7), 3, 3, P.leafLo);
}

export function drawLamp(c: Ctx, x: number, groundY: number) {
  px(c, x + 1, groundY - 26, 2, 26, P.steelLo);
  px(c, x + 1, groundY - 26, 1, 26, P.steel);
  px(c, x + 3, groundY - 26, 6, 2, P.steelLo);
  px(c, x + 8, groundY - 25, 4, 2, P.glassLit);
  px(c, x, groundY - 1, 4, 1, P.walkLo);
}

export function drawStreetCar(c: Ctx, x: number, groundY: number, col: string) {
  panel(c, x, groundY - 7, 18, 5, col, "#FFFFFF33", P.ink);
  px(c, x + 3, groundY - 10, 10, 3, col);
  px(c, x + 4, groundY - 9, 8, 2, P.glass);
  px(c, x + 2, groundY - 2, 3, 2, P.wheel);
  px(c, x + 13, groundY - 2, 3, 2, P.wheel);
}

/* ── the elevated structure ─────────────────────────────────── */

/** One bay of the el: two columns, a cross beam, diagonal bracing. */
export function drawElBay(c: Ctx, x: number, deckY: number, streetY: number) {
  const h = streetY - deckY;
  px(c, x, deckY, 3, h, P.steel);
  px(c, x, deckY, 1, h, P.steelHi);
  px(c, x + 2, deckY, 1, h, P.steelLo);
  // Footing
  px(c, x - 2, streetY - 2, 7, 2, P.steelLo);
  // Cross beam a third of the way down
  px(c, x - 10, deckY + Math.round(h * 0.42), 23, 2, P.steel);
  // Diagonal bracing, drawn as a pixel staircase
  const steps = Math.round(h * 0.34);
  for (let i = 0; i < steps; i++) {
    px(c, x + 3 + i, deckY + Math.round(h * 0.42) - i, 1, 1, P.steelLo);
    px(c, x - 1 - i, deckY + Math.round(h * 0.42) - i, 1, 1, P.steelLo);
  }
}

/** Deck, sleepers, running rails and the third rail. */
export function drawDeck(c: Ctx, w: number, deckY: number, shift: number) {
  px(c, 0, deckY, w, 3, P.steelLo);
  px(c, 0, deckY, w, 1, P.steel);
  // Sleepers stream past; the rails do not.
  const gap = 6;
  const off = Math.round(((shift % gap) + gap) % gap);
  for (let x = -off; x < w; x += gap) px(c, x, deckY - 2, 3, 2, P.tie);
  px(c, 0, deckY - 3, w, 1, P.rail);
  // Protection board over the third rail, street side.
  px(c, 0, deckY + 3, w, 1, "#D8D2C4");
}

/* ── rolling stock ──────────────────────────────────────────── */

export const CAR_W = 104;
export const CAR_H = 40;

/**
 * One R211-ish car. `accent` is the route colour, which is the only
 * thing that changes between cars.
 */
export function drawCar(
  c: Ctx,
  x: number,
  baseY: number,
  accent: string,
  opts: { cab?: boolean; lit?: number } = {},
) {
  const { cab = false, lit = 1 } = opts;
  const y = baseY - CAR_H;
  const w = CAR_W;

  // Trucks first, so the body sits over them.
  for (const tx of [x + 14, x + w - 30]) {
    px(c, tx, baseY - 8, 16, 5, P.truck);
    px(c, tx + 1, baseY - 4, 4, 4, P.wheel);
    px(c, tx + 11, baseY - 4, 4, 4, P.wheel);
    px(c, tx + 2, baseY - 3, 2, 2, "#4A525C");
    px(c, tx + 12, baseY - 3, 2, 2, "#4A525C");
  }

  // Body shell with rounded-looking corners (one pixel bitten off each).
  px(c, x + 1, y + 2, w - 2, CAR_H - 10, P.car);
  px(c, x, y + 4, w, CAR_H - 14, P.car);
  // Top highlight, bottom shadow — single light source, top-left.
  px(c, x + 1, y + 2, w - 2, 1, P.carHi);
  px(c, x + 1, y + 3, w - 2, 1, P.carHi);
  px(c, x + 1, y + CAR_H - 9, w - 2, 1, P.carEdge);

  // Roof with air-conditioning blocks.
  px(c, x + 3, y, w - 6, 3, P.roof);
  px(c, x + 3, y, w - 6, 1, P.roofHi);
  px(c, x + 14, y - 3, 22, 3, P.roof);
  px(c, x + w - 38, y - 3, 22, 3, P.roof);
  px(c, x + 14, y - 3, 22, 1, P.roofHi);
  px(c, x + w - 38, y - 3, 22, 1, P.roofHi);

  // Corrugated flank: alternating rows of slightly darker steel.
  for (let ry = y + 26; ry < y + CAR_H - 10; ry += 2) {
    px(c, x + 2, ry, w - 4, 1, P.carLo);
  }

  // Route stripe under the roofline.
  px(c, x + 2, y + 6, w - 4, 2, accent);

  // Window band.
  const winY = y + 12;
  const winH = 9;
  const doorXs = cab ? [x + 30, x + 68] : [x + 20, x + 58];
  const isDoor = (wx: number) =>
    doorXs.some((dx) => wx + 10 > dx && wx < dx + 18);

  for (let wx = x + 6; wx < x + w - 12; wx += 13) {
    if (isDoor(wx)) continue;
    px(c, wx - 1, winY - 1, 12, winH + 2, P.ink);
    px(c, wx, winY, 10, winH, lit > 0.5 ? P.glassLit : P.glass);
    // A rider silhouette, so the car is never empty.
    if ((wx + baseY) % 3 !== 0) {
      px(c, wx + 3, winY + 3, 4, 6, "#5A4636");
      px(c, wx + 4, winY + 1, 2, 2, "#5A4636");
    }
    px(c, wx, winY, 10, 1, P.white);
  }

  // Sliding door pairs.
  for (const dx of doorXs) {
    px(c, dx, y + 9, 18, CAR_H - 19, P.carHi);
    px(c, dx, y + 9, 1, CAR_H - 19, P.white);
    px(c, dx + 17, y + 9, 1, CAR_H - 19, P.carEdge);
    px(c, dx + 8, y + 9, 1, CAR_H - 19, P.carEdge);
    px(c, dx + 1, winY, 7, winH, lit > 0.5 ? P.glassLit : P.glass);
    px(c, dx + 10, winY, 7, winH, lit > 0.5 ? P.glassLit : P.glass);
    px(c, dx, y + CAR_H - 12, 18, 1, accent);
  }

  // Skirt.
  px(c, x + 4, y + CAR_H - 8, w - 8, 3, P.skirt);

  if (cab) {
    // Blunt front end, windshield, headlights, marker lamps.
    px(c, x + w - 2, y + 6, 2, CAR_H - 16, P.carLo);
    px(c, x + w - 14, y + 11, 11, 8, P.ink);
    px(c, x + w - 13, y + 12, 9, 6, P.glassHi);
    px(c, x + w - 6, y + CAR_H - 14, 4, 3, "#FFF6D8");
    px(c, x + w - 6, y + 4, 3, 2, "#FF5647");
  }
}

/** The route bullet decal, drawn as a pixel disc. */
export function drawBullet(c: Ctx, x: number, y: number, col: string, label: string) {
  const r = 7;
  // Filled circle on the pixel grid.
  for (let dy = -r; dy <= r; dy++) {
    const span = Math.floor(Math.sqrt(r * r - dy * dy));
    px(c, x - span, y + dy, span * 2 + 1, 1, col);
  }
  c.fillStyle = col === "#FCCC0A" ? "#000000" : "#FFFFFF";
  c.font = "bold 9px ui-monospace, monospace";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText(label, x, y + 1);
}

/* ── clouds ─────────────────────────────────────────────────── */

export function drawCloud(c: Ctx, x: number, y: number, scale: number) {
  const rows: [number, number][] = [
    [6, 3],
    [3, 9],
    [0, 15],
    [1, 13],
  ];
  rows.forEach(([ox, w], i) => {
    px(c, x + ox * scale, y + i * 2, w * scale, 2, i < 2 ? P.cloud : P.cloudMid);
  });
  px(c, x, y + 8, 15 * scale, 2, P.cloudShade);
}
