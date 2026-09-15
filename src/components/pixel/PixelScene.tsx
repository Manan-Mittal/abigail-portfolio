"use client";

import { useEffect, useRef } from "react";
import { P } from "./palette";
import {
  CAR_W,
  CAR_H,
  drawBrownstone,
  drawBullet,
  drawCar,
  drawCloud,
  drawDeck,
  drawElBay,
  drawLamp,
  drawStreetCar,
  drawTower,
  drawTree,
  drawWaterTower,
  mix,
  px,
  skyBands,
} from "./draw";
import { experiences } from "@/data/portfolio";
import { routeColors } from "@/lib/palette";
import { scrollState, seeded, lerp, between } from "@/lib/scroll";
import { rideState } from "@/lib/ride";

/* ── scene geometry, in internal pixels ─────────────────────── */

const TILE = 480;       // width of each repeating parallax tile
const GAP = 6;          // coupling gap between cars
const PITCH = CAR_W + GAP;

/**
 * Internal resolution is the viewport divided by an integer scale, so the
 * canvas always matches the page's aspect exactly — no letterboxing, no
 * cropping, and every art pixel lands on the same number of screen pixels.
 */
type Geo = {
  w: number;
  h: number;
  deckY: number;
  streetY: number;
  scale: number;
  /** True when the layout stacks copy under the scene. Measured in CSS
   *  pixels — `w` is in art pixels and is far smaller. */
  narrow: boolean;
};

function computeGeo(): Geo {
  const vw = Math.max(320, window.innerWidth);
  const vh = Math.max(360, window.innerHeight);
  // Aim for roughly 230 art pixels tall, clamped to sensible zoom levels.
  const scale = Math.max(2, Math.min(6, Math.round(vh / 230)));
  const w = Math.ceil(vw / scale);
  const h = Math.ceil(vh / scale);
  return {
    w,
    h,
    deckY: Math.round(h * 0.56),
    streetY: Math.round(h * 0.84),
    scale,
    narrow: vw < 900,
  };
}

function makeTile(w: number, h: number) {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  return { cv, ctx };
}

/* ── layer builders (run once, then blitted) ────────────────── */

function buildSky(w: number, h: number, dusk: number) {
  const { cv, ctx } = makeTile(w, h);
  // Dusk here means golden hour, not night — the scene should stay warm
  // and legible rather than sinking into the dark.
  skyBands(ctx, w, h, [
    { at: 0, col: mix(P.skyTop, "#6E85C4", dusk) },
    { at: 0.3, col: mix(P.skyMid, "#C79BC0", dusk) },
    { at: 0.55, col: mix(P.skyLow, "#F0A87E", dusk) },
    { at: 0.72, col: mix(P.skyHaze, "#FFD08A", dusk) },
  ]);

  // Sun, sinking as the ride goes on.
  const sx = Math.round(w * 0.74);
  const sy = Math.round(h * (0.2 + dusk * 0.34));
  for (let dy = -9; dy <= 9; dy++) {
    const span = Math.floor(Math.sqrt(81 - dy * dy));
    px(ctx, sx - span, sy + dy, span * 2 + 1, 1, P.sun);
  }
  for (let dy = -6; dy <= 6; dy++) {
    const span = Math.floor(Math.sqrt(36 - dy * dy));
    px(ctx, sx - span, sy + dy, span * 2 + 1, 1, P.sunCore);
  }
  return cv;
}

function buildClouds() {
  const { cv, ctx } = makeTile(TILE, 70);
  const rand = seeded(7);
  for (let i = 0; i < 7; i++) {
    drawCloud(
      ctx,
      Math.round(12 + rand() * (TILE - 80)),
      Math.round(6 + rand() * 44),
      rand() > 0.6 ? 2 : 1,
    );
  }
  return cv;
}

function buildFar(h: number, streetY: number, lit: number) {
  const { cv, ctx } = makeTile(TILE, h);
  const rand = seeded(21);
  // Horizon sits a little above street level to fake distance.
  const ground = streetY - 12;
  let x = 0;
  while (x < TILE) {
    const w = 10 + Math.round(rand() * 14);
    const h = 40 + Math.round(rand() * 70);
    const pal = [P.farA, P.farB, P.farC][Math.floor(rand() * 3)];
    if (x + w < TILE) drawTower(ctx, x, ground, w, h, pal, lit);
    x += w + 2 + Math.round(rand() * 6);
  }
  return cv;
}

function buildMid(h: number, streetY: number, lit: number) {
  const { cv, ctx } = makeTile(TILE, h);
  const rand = seeded(43);
  const ground = streetY - 3;
  let x = 2;
  while (x < TILE - 40) {
    const w = 26 + Math.round(rand() * 20);
    const h = 52 + Math.round(rand() * 46);
    drawBrownstone(ctx, x, ground, w, h, Math.floor(rand() * 97), lit);
    if (rand() > 0.55) {
      drawWaterTower(ctx, x + Math.round(w / 2) - 5, ground - h - 3);
    }
    x += w + 3 + Math.round(rand() * 5);
  }
  return cv;
}

function buildForeground(h: number, streetY: number) {
  const { cv, ctx } = makeTile(TILE, h);
  const rand = seeded(91);
  // Street, kerb and centre line.
  px(ctx, 0, streetY, TILE, h - streetY, P.street);
  px(ctx, 0, streetY, TILE, 1, "#6B737D");
  for (let x = 4; x < TILE; x += 14) px(ctx, x, streetY + 12, 7, 1, P.streetLine);
  px(ctx, 0, streetY + 20, TILE, Math.max(0, h - streetY - 20), P.walk);
  px(ctx, 0, streetY + 20, TILE, 1, P.walkLo);

  const paint = ["#D9B14F", "#D9B14F", "#B8473F", "#3E6FA8", "#DCDCDC", "#3E8C63"];
  let x = 6;
  while (x < TILE - 30) {
    const roll = rand();
    if (roll > 0.72) drawTree(ctx, x, streetY + 20, 1);
    else if (roll > 0.52) drawLamp(ctx, x, streetY + 20);
    else drawStreetCar(ctx, x, streetY + 16, paint[Math.floor(rand() * paint.length)]);
    x += 26 + Math.round(rand() * 22);
  }
  return cv;
}

/** The whole consist, drawn once into one wide strip. */
function buildTrain(lit: number) {
  const cars = experiences.length + 1; // cab + one per role
  const w = cars * PITCH + 20;
  const { cv, ctx } = makeTile(w, CAR_H + 18);
  const baseY = CAR_H + 10;

  // Cab at the right-hand end, cars trailing to the left.
  const cabX = w - CAR_W - 10;
  experiences.forEach((exp, i) => {
    const x = cabX - (i + 1) * PITCH;
    const accent = routeColors[exp.route];
    drawCar(ctx, x, baseY, accent, { lit });
    drawBullet(ctx, x + CAR_W - 22, baseY - CAR_H + 25, accent, exp.route);
  });
  drawCar(ctx, cabX, baseY, routeColors[experiences[0]?.route ?? "7"], {
    cab: true,
    lit,
  });

  return { cv, cabX, baseY };
}

/* ── the component ──────────────────────────────────────────── */

export function PixelScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let geo = computeGeo();
    let raf = 0;
    let trainX = 0;
    let started = false;

    // Layer caches. Sky and lit-window layers are rebuilt only when their
    // bucket changes, so a steady-state frame is a handful of blits.
    let skyCv: HTMLCanvasElement | null = null;
    let skyBucket = -1;
    let cloudCv: HTMLCanvasElement | null = null;
    let farCv: HTMLCanvasElement | null = null;
    let midCv: HTMLCanvasElement | null = null;
    let fgCv: HTMLCanvasElement | null = null;
    let litBucket = -1;
    let train: ReturnType<typeof buildTrain> | null = null;

    const resize = () => {
      geo = computeGeo();
      canvas.width = geo.w;
      canvas.height = geo.h;
      ctx.imageSmoothingEnabled = false;
      skyBucket = -1;
      litBucket = -1;
      cloudCv = buildClouds();
      fgCv = buildForeground(geo.h, geo.streetY);
      // Setting width/height wipes the canvas, so repaint immediately.
      draw();
    };

    /** Blit a repeating tile across the full width at `offset`. */
    const tile = (src: HTMLCanvasElement, offset: number, y = 0) => {
      const w = src.width;
      let x = -(((offset % w) + w) % w);
      while (x < geo.w) {
        ctx.drawImage(src, Math.round(x), y);
        x += w;
      }
    };

    /** Draw exactly one frame. Kept separate from the animation loop so
     *  it can also be called straight after a resize or on becoming
     *  visible — resizing a canvas clears it, and rAF does not fire in a
     *  hidden tab, which would otherwise leave the scene blank. */
    const draw = () => {
      const progress = scrollState.progress;
      const dusk = between(progress, 0.25, 0.95);
      const lit = between(progress, 0.4, 0.9);

      const sb = Math.round(dusk * 10);
      if (sb !== skyBucket) {
        skyBucket = sb;
        skyCv = buildSky(geo.w, geo.h, sb / 10);
      }
      const lb = lit > 0.5 ? 1 : 0;
      if (lb !== litBucket) {
        litBucket = lb;
        farCv = buildFar(geo.h, geo.streetY, lb ? 0.55 : 0.05);
        midCv = buildMid(geo.h, geo.streetY, lb ? 0.7 : 0.06);
        train = buildTrain(lb);
      }
      if (!skyCv || !farCv || !midCv || !fgCv || !cloudCv || !train) return;

      const shift = scrollState.pixels * 0.34;

      ctx.drawImage(skyCv, 0, 0);
      tile(cloudCv, shift * 0.08, Math.round(geo.h * 0.05));
      tile(farCv, shift * 0.22);
      tile(midCv, shift * 0.45);

      // Elevated structure, moving with the world.
      const BAY = 46;
      const bayOff = -(((shift % BAY) + BAY) % BAY);
      for (let x = bayOff; x < geo.w + BAY; x += BAY) {
        drawElBay(ctx, Math.round(x), geo.deckY + 3, geo.streetY + 4);
      }
      drawDeck(ctx, geo.w, geo.deckY, shift);

      // Slide the consist so the focused car sits in the clear half:
      // beside the copy on wide screens, centred on narrow ones.
      const focusLeft = Math.round(
        (geo.narrow ? geo.w * 0.5 : geo.w * 0.72) - CAR_W / 2,
      );
      const target =
        focusLeft -
        train.cabX +
        (rideState.targetCar < 0 ? 0 : (rideState.targetCar + 1) * PITCH);

      if (!started) {
        trainX = target;
        started = true;
      }
      trainX = lerp(trainX, target, 0.12);

      // A one-pixel bob. Any more and it reads as broken, not alive.
      const bob = scrollState.reducedMotion
        ? 0
        : Math.sin(performance.now() / 300) > 0
          ? 0
          : 1;

      ctx.drawImage(train.cv, Math.round(trainX), geo.deckY - train.baseY + bob);

      tile(fgCv, shift * 1.35);
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      draw();
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", draw);
    loop();
    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", draw);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pixel-canvas"
      aria-hidden="true"
    />
  );
}
