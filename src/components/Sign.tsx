import { cn } from "@/lib/cn";

/**
 * The black enamel station sign. White Helvetica-lineage type on a
 * near-black field, with a hairline rule — the MTA Standards Manual
 * look, which is also just very good information design.
 */
export function Sign({
  children,
  className,
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[10px] bg-[#0a0a0a] px-5 py-3.5 text-white shadow-[0_10px_30px_-14px_rgba(0,0,0,0.7)]",
        className,
      )}
    >
      {accent && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[5px]"
          style={{ background: accent }}
        />
      )}
      {children}
    </div>
  );
}
