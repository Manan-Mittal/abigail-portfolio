"use client";

import { experiences } from "@/data/portfolio";
import { routeColors } from "@/lib/palette";
import { cn } from "@/lib/cn";

type Stop = { id: string; label: string; anchor: string };

const stops: Stop[] = [
  { id: "start", label: "Start", anchor: "top" },
  ...experiences.map((e) => ({
    id: e.id,
    label: e.station,
    anchor: `car-${e.id}`,
  })),
  { id: "work", label: "Selected work", anchor: "work" },
  { id: "credentials", label: "Education", anchor: "credentials" },
  { id: "end", label: "Last stop", anchor: "contact" },
];

/**
 * A vertical strip map, like the one above the doors. It is the site's
 * primary navigation as well as its progress indicator — one element
 * doing both jobs, which is how the real thing works too.
 */
export function LineProgress({ activeId }: { activeId: string }) {
  const activeIndex = Math.max(
    0,
    stops.findIndex((s) => s.id === activeId),
  );

  return (
    <nav
      aria-label="Stops on this line"
      className="strip-map fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <ol className="relative flex flex-col gap-7">
        {/* The line itself, drawn behind the stops. */}
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-2 bottom-2 w-[3px] rounded-full bg-[var(--card-line)]"
        />
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-2 w-[3px] rounded-full transition-all duration-500"
          style={{
            height: `calc(${(activeIndex / Math.max(1, stops.length - 1)) * 100}% - 0px)`,
            background: routeColors[experiences[0]?.route ?? "7"],
          }}
        />

        {stops.map((stop, i) => {
          const isActive = stop.id === activeId;
          const passed = i <= activeIndex;
          return (
            <li key={stop.id} className="relative">
              <a
                href={`#${stop.anchor}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center gap-3"
              >
                <span
                  className={cn(
                    "relative z-10 grid h-[17px] w-[17px] place-items-center rounded-full border-[3px] bg-[var(--bg)] transition-all duration-300",
                    isActive ? "scale-125" : "scale-100",
                  )}
                  style={{
                    borderColor: passed
                      ? routeColors[experiences[0]?.route ?? "7"]
                      : "var(--card-line)",
                  }}
                />
                <span
                  className={cn(
                    "whitespace-nowrap text-[0.78rem] font-medium tracking-tight transition-all duration-300",
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-70 group-focus-visible:opacity-100",
                  )}
                >
                  {stop.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { stops };
