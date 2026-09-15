import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import {
  education,
  experiences,
  honors,
  profile,
  projects,
  terminus,
} from "@/data/portfolio";
import { routeColors } from "@/lib/palette";
import { RouteBullet } from "./RouteBullet";
import { Sign } from "./Sign";

/** Shared column: keeps copy clear of the train on wide screens. */
function Column({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6">
      <div className="max-w-[34rem]">{children}</div>
    </div>
  );
}

/* ── hero ───────────────────────────────────────────────────── */

export function Hero() {
  const first = experiences[0];
  return (
    <section
      data-stop="start"
      id="top"
      className="relative flex min-h-[100svh] items-end pb-16 pt-[46svh] sm:items-center sm:pt-24"
    >
      <Column>
        <Sign accent={routeColors[first.route]} className="mb-7 inline-block">
          <div className="flex items-center gap-3">
            <RouteBullet route={first.route} size="sm" />
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/75">
              Now arriving
            </span>
          </div>
        </Sign>

        <h1 className="text-[clamp(2.5rem,7vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
          {profile.name}
        </h1>

        <p className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[var(--fg)]/50">
          {profile.title} · {profile.pronouns}
        </p>

        <p className="mt-5 text-[clamp(1.05rem,2.3vw,1.3rem)] leading-snug tracking-tight text-[var(--fg)]/80">
          {profile.tagline}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href={`#car-${first.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--fg)] px-5 py-2.5 text-sm font-medium text-[var(--bg)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Ride the line
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--fg)]/5"
          >
            Get in touch
          </Link>
        </div>

        <p className="mt-9 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--fg)]/45">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {profile.location}
        </p>
      </Column>
    </section>
  );
}

/* ── marquee ────────────────────────────────────────────────── */

export function Toolbelt() {
  const items = [...profile.toolbelt, ...profile.toolbelt];
  return (
    <section aria-label="Areas of practice" className="relative overflow-hidden">
      <div className="border-y-2 bg-[var(--card)] backdrop-blur-md">
        <div className="marquee-track flex w-max gap-10 py-3.5">
          {items.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="flex items-center gap-10 whitespace-nowrap font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--fg)]/55"
            >
              {t}
              <span aria-hidden="true" className="text-[var(--fg)]/25">
                ◆
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── about ──────────────────────────────────────────────────── */

export function About() {
  return (
    <section data-stop="start" id="about" className="relative pb-20 pt-[30svh] sm:py-28">
      <Column>
        <div className="surface p-7 sm:p-9">
          <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--fg)]/50">
            Service notice
          </h2>
          <p className="mt-4 text-[1.1rem] leading-relaxed tracking-tight">
            {profile.intro}
          </p>
          <p className="mt-4 leading-relaxed text-[var(--fg)]/75">
            {profile.intro2}
          </p>
        </div>
      </Column>
    </section>
  );
}

/* ── the cars ───────────────────────────────────────────────── */

export function Cars() {
  return (
    <section id="experience" aria-label="Experience">
      {experiences.map((exp, i) => (
        <article
          key={exp.id}
          id={`car-${exp.id}`}
          data-stop={exp.id}
          data-car={i}
          className="relative flex min-h-[100svh] items-end pb-14 pt-[38svh] sm:items-center sm:py-20"
        >
          <Column>
            <Sign accent={routeColors[exp.route]} className="mb-6">
              <div className="flex items-center gap-3.5">
                <RouteBullet
                  route={exp.route}
                  size="md"
                  label={`${exp.route} train, car ${i + 1}`}
                />
                <div className="min-w-0">
                  <p className="truncate text-[1.02rem] font-semibold leading-tight tracking-tight">
                    {exp.station}
                  </p>
                  <p className="mt-0.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/60">
                    Car {i + 1} of {experiences.length} · {exp.period}
                  </p>
                </div>
              </div>
            </Sign>

            <div className="surface p-7 sm:p-9">
              <h3 className="text-[clamp(1.35rem,3.2vw,1.85rem)] font-semibold leading-tight tracking-[-0.03em]">
                {exp.role}
              </h3>
              <p className="mt-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--fg)]/50">
                {exp.org} · {exp.location}
              </p>

              <p className="mt-5 leading-relaxed text-[var(--fg)]/80">{exp.blurb}</p>

              <ul className="mt-6 space-y-3">
                {exp.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-[0.94rem] leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="mt-[0.5em] h-2 w-2 shrink-0"
                      style={{ background: routeColors[exp.route] }}
                    />
                    <span className="text-[var(--fg)]/80">{h}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-2">
                {exp.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-[var(--fg)]/60"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Column>
        </article>
      ))}
    </section>
  );
}

/* ── projects ───────────────────────────────────────────────── */

export function Work() {
  return (
    <section data-stop="work" id="work" className="relative pb-20 pt-[30svh] sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-w-[34rem]">
          <Sign accent="#808183" className="mb-7 inline-block">
            <div className="flex items-center gap-3">
              <RouteBullet route="S" size="sm" label="Shuttle" />
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/75">
                Selected work
              </span>
            </div>
          </Sign>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((p) => (
            <article key={p.id} className="surface flex flex-col p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[1.15rem] font-semibold tracking-[-0.02em]">
                  {p.name}
                </h3>
                <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-[var(--fg)]/45">
                  {p.year}
                </span>
              </div>
              <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-[var(--fg)]/50">
                {p.kind}
              </p>
              <p className="mt-4 flex-1 text-[0.92rem] leading-relaxed text-[var(--fg)]/75">
                {p.blurb}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-[var(--fg)]/55"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── education, honours, languages ──────────────────────────── */

export function Credentials() {
  return (
    <section data-stop="credentials" id="credentials" className="relative pb-20 pt-[26svh] sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-w-[34rem]">
          <Sign accent="#6CBE45" className="mb-7 inline-block">
            <div className="flex items-center gap-3">
              <RouteBullet route="G" size="sm" label="Credentials" />
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/75">
                Education &amp; honours
              </span>
            </div>
          </Sign>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="surface p-7">
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/50">
              Education
            </h3>
            <ul className="mt-5 space-y-5">
              {education.map((e) => (
                <li key={e.id}>
                  <p className="font-semibold tracking-tight">{e.degree}</p>
                  <p className="mt-1 text-[0.88rem] leading-snug text-[var(--fg)]/70">
                    {e.school}
                  </p>
                  <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-[var(--fg)]/50">
                    {e.detail} · {e.year}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface p-7">
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/50">
              Honours &amp; awards
            </h3>
            <ul className="mt-5 space-y-4">
              {honors.map((h) => (
                <li key={h.id} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.45em] h-2 w-2 shrink-0 bg-[var(--color-accent)]"
                  />
                  <div>
                    <p className="font-medium leading-snug tracking-tight">{h.name}</p>
                    <p className="mt-0.5 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-[var(--fg)]/50">
                      {h.issuer} · {h.year}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="hairline my-6" />
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--fg)]/50">
              Languages
            </h3>
            <p className="mt-2 text-[0.92rem] text-[var(--fg)]/75">
              {profile.languages.join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── last stop ──────────────────────────────────────────────── */

export function Contact() {
  return (
    <section
      data-stop="end"
      id="contact"
      className="relative flex min-h-[80svh] items-end pb-16 pt-[26svh] sm:items-center sm:py-28"
    >
      <Column>
        <Sign className="mb-7 inline-block">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/75">
            {terminus.heading}
          </span>
        </Sign>

        <h2 className="text-[clamp(1.8rem,4.6vw,2.7rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
          {terminus.body}
        </h2>

        <div className="mt-8 flex flex-wrap gap-3">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-full border-2 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--fg)]/5"
            >
              {s.label}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          ))}
        </div>

        <p className="mt-14 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[var(--fg)]/40">
          Stand clear of the closing doors, please.
        </p>
      </Column>
    </section>
  );
}
