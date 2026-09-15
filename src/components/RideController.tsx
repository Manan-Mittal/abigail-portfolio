"use client";

import { useEffect, useState } from "react";
import { rideState } from "@/lib/ride";
import { LineProgress } from "./LineProgress";

/**
 * Reports the current stop to both the strip map and the pixel scene.
 *
 * Measurement is driven by scroll/resize events, never by
 * requestAnimationFrame. rAF does not fire while the tab is hidden, so
 * anything that depends on it for *correctness* silently freezes and
 * then shows a stale stop when the reader comes back. rAF is for
 * animation; this is state.
 *
 * Choosing by "which section contains the viewport midpoint" rather than
 * "nearest centre" also avoids near-ties between adjacent full-height
 * sections, and an IntersectionObserver is no good here because its
 * callback only carries the entries whose intersection changed.
 *
 * Behaviour only — every word on the page is server-rendered, so this
 * can fail without taking the content with it.
 */
export function RideController() {
  const [activeId, setActiveId] = useState("start");

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-stop]"),
    );
    if (!sections.length) return;

    let lastId = "";

    const measure = () => {
      const mid = window.innerHeight / 2;

      // Sections tile the page, so exactly one contains the midpoint.
      let chosen: HTMLElement | null = null;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          chosen = el;
          break;
        }
      }

      // Fallback for the gaps between sections (the marquee, the footer).
      if (!chosen) {
        let best = Infinity;
        for (const el of sections) {
          const r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) continue;
          const d = Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid));
          if (d < best) {
            best = d;
            chosen = el;
          }
        }
      }

      if (!chosen) return;
      const car = chosen.dataset.car;
      rideState.targetCar = car === undefined ? -1 : Number(car);

      const id = chosen.dataset.stop!;
      if (id !== lastId) {
        lastId = id;
        setActiveId(id);
      }
    };

    // Measuring a handful of rects is cheap enough to do per event;
    // browsers already coalesce scroll events to one per frame.
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    // Re-sync on return: the page may have been scrolled while hidden.
    document.addEventListener("visibilitychange", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", measure);
    };
  }, []);

  return <LineProgress activeId={activeId} />;
}
