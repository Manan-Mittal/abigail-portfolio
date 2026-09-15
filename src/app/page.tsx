import { RideCanvas } from "@/components/RideCanvas";
import { RideController } from "@/components/RideController";
import {
  Hero,
  Toolbelt,
  About,
  Cars,
  Work,
  Credentials,
  Contact,
} from "@/components/sections";

export default function Page() {
  return (
    <>
      {/* Fixed 3D backdrop. Everything below is real, indexable HTML. */}
      <RideCanvas />
      <div className="scene-tint" aria-hidden="true" />
      <div className="copy-scrim" aria-hidden="true" />
      <RideController />

      <main id="main" className="relative z-10">
        <Hero />
        <Toolbelt />
        <About />
        <Cars />
        <Work />
        <Credentials />
        <Contact />
      </main>

      <footer className="relative z-10 border-t py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 text-[0.75rem] text-[var(--fg)]/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Built with Next.js, canvas pixel art and Vercel&rsquo;s Geist.
          </p>
          <p className="font-mono uppercase tracking-[0.14em]">
            Route bullets © MTA, used affectionately
          </p>
        </div>
      </footer>
    </>
  );
}
