import { routeColors, routeTextColor, type Route } from "@/lib/palette";
import { cn } from "@/lib/cn";

const sizes = {
  sm: "h-6 w-6 text-[0.8rem]",
  md: "h-9 w-9 text-[1.15rem]",
  lg: "h-14 w-14 text-[1.8rem]",
};

/**
 * The MTA route bullet. Perfectly circular, Helvetica-weight glyph,
 * black text only on the yellow line. It carries meaning, so it gets a
 * real accessible label rather than being left as decoration.
 */
export function RouteBullet({
  route,
  size = "md",
  className,
  label,
}: {
  route: Route;
  size?: keyof typeof sizes;
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold leading-none tabular-nums select-none",
        sizes[size],
        className,
      )}
      style={{
        backgroundColor: routeColors[route],
        color: routeTextColor(route),
      }}
      role="img"
      aria-label={label ?? `${route} train`}
    >
      <span aria-hidden="true" className="translate-y-[0.03em]">
        {route}
      </span>
    </span>
  );
}
