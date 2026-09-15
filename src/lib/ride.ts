"use client";

/**
 * Bridge between the DOM sections and the 3D scene.
 * The DOM is the source of truth for "which car am I looking at" — an
 * IntersectionObserver on the real sections sets this, and the render
 * loop eases the train toward it. Scrolling, deep links and keyboard
 * navigation therefore all produce the same camera move for free.
 */
export const rideState = {
  /** -1 = cab / hero, 0..n-1 = car index. */
  targetCar: -1,
};

/** Centre-to-centre distance between cars, in world units.
 *  A real R211 is 60ft; this is scaled to read well at our camera. */
export const CAR_SPACING = 7.1;

export function carOffset(index: number) {
  // The cab car sits at 0; car 0 is one spacing behind it.
  return index < 0 ? 0 : CAR_SPACING * (index + 1);
}
