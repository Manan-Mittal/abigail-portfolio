"use client";

import { useEffect } from "react";

/**
 * Scroll is read by the 3D render loop every frame. Keeping it in a
 * module-level mutable object (instead of React state) means scrolling
 * never re-renders the React tree — the canvas just reads the number.
 */
export const scrollState = {
  /** 0 → 1 across the whole document. */
  progress: 0,
  /** Raw pixels, useful for parallax that should not depend on page length. */
  pixels: 0,
  /** Smoothed pixels/frame, drives train lean and wheel spin. */
  velocity: 0,
  /** Set once we know the user prefers less motion. */
  reducedMotion: false,
};

/** Installs the single scroll/resize listener for the whole app. */
export function useScrollDriver() {
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      scrollState.reducedMotion = motionQuery.matches;
    };
    syncMotion();
    motionQuery.addEventListener("change", syncMotion);

    let last = window.scrollY;
    let raf = 0;

    const read = () => {
      const y = window.scrollY;
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      scrollState.pixels = y;
      scrollState.progress = Math.min(1, Math.max(0, y / max));
      // Low-pass filter so a trackpad fling does not snap the scene sideways.
      scrollState.velocity += ((y - last) - scrollState.velocity) * 0.25;
      last = y;
    };

    /**
     * Scroll position is read from the scroll event, not from rAF: rAF
     * stops firing while the tab is hidden, and the scene would then be
     * drawn from a stale position on the first frame back. The rAF loop
     * only smooths the value between events.
     */
    const loop = () => {
      raf = requestAnimationFrame(loop);
      read();
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    loop();
    return () => {
      motionQuery.removeEventListener("change", syncMotion);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
      cancelAnimationFrame(raf);
    };
  }, []);
}

/** Deterministic PRNG — the city must look identical on every render. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
/** Smooth 0→1 ramp between two scroll progress points. */
export const between = (p: number, a: number, b: number) =>
  clamp((p - a) / (b - a), 0, 1);
