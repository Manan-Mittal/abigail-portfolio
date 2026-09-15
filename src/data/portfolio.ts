/**
 * ─────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU NEED TO EDIT TO CHANGE THE CONTENT.
 * ─────────────────────────────────────────────────────────────
 *  Sourced from Abigail's LinkedIn. Add or remove an entry in
 *  `experiences` and the train grows or shrinks a car to match —
 *  nothing else to touch.
 *
 *  Route bullets are real MTA routes, chosen to mean something:
 *  the E terminates at World Trade Center, the 7 is the elevated
 *  line, the L runs under 14th Street.
 * ─────────────────────────────────────────────────────────────
 */

import type { Route } from "@/lib/palette";

export type Experience = {
  id: string;
  role: string;
  org: string;
  /** Shown on the station sign; keep it short. */
  period: string;
  location: string;
  /** The route bullet painted on this car. Colour follows the route. */
  route: Route;
  /** Station-sign name for this stop. Shorter than the org. */
  station: string;
  blurb: string;
  highlights: string[];
  skills: string[];
  href?: string;
};

export type Project = {
  id: string;
  name: string;
  kind: string;
  year: string;
  blurb: string;
  tags: string[];
  href?: string;
};

export const profile = {
  name: "Abigail Alvarez",
  pronouns: "She/Her",
  title: "Urban Planner",
  tagline:
    "Working toward sustainable, equitable and vibrant cities — and transportation that serves everyone.",
  headline:
    "Port Authority Leadership Fellow · NYMTC 9/11 Memorial Research Fellow · Rutgers IWL Alumna · MTA ACTA Committee Member",
  intro:
    "I'm a dedicated urban planning professional working for sustainable, equitable, and vibrant cities. " +
    "My experience in transportation and placemaking spans the top agencies in the country — federally at the " +
    "U.S. DOT Volpe Center, and at the interstate level with NJ TRANSIT, NYC DOT, and the Institute for " +
    "Transportation & Development Policy.",
  intro2:
    "I'm driven by a commitment to creating inclusive and innovative transportation systems that serve all " +
    "members of our communities. In my free time I love cafe-hopping, dancing at concerts, reading, and antiquing.",
  location: "New York City Metropolitan Area",
  languages: ["English", "Spanish"],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/abigail-alvarezzz/" },
    { label: "Student Spotlight", href: "https://bloustein.rutgers.edu/abigail-alvarez/" },
  ],
  /** Marquee under the hero. */
  toolbelt: [
    "Transportation planning",
    "Placemaking",
    "Public realm",
    "Community engagement",
    "Transit accessibility",
    "Qualitative research",
    "Thematic analysis",
    "Public policy",
  ],
};

/** Car 1 is at the front, right behind the operator's cab. */
export const experiences: Experience[] = [
  {
    id: "port-authority",
    role: "Leadership Fellow",
    org: "The Port Authority of New York & New Jersey",
    period: "Jul 2026 — Present",
    location: "New York, NY · On-site",
    route: "E",
    station: "World Trade Center",
    blurb:
      "Full-time leadership fellowship rotating through the agency. Rotation 1 is with the " +
      "World Trade Center Department, working on placemaking across the campus.",
    highlights: [
      "Helped launch the first kids-oriented placemaking activation on the World Trade Center Campus",
      "Co-created “The Flowering Feedback Garden,” a flower-post-it engagement map that drew families from across the country",
      "Member of the Port Authority Hispanic Society",
    ],
    skills: ["Placemaking", "Community engagement", "Public space activation"],
  },
  {
    id: "mta-acta",
    role: "Committee Member, Advisory Committee for Transit Accessibility",
    org: "Metropolitan Transportation Authority",
    period: "Jun 2026 — Present",
    location: "New York, NY",
    route: "L",
    station: "Transit Accessibility",
    blurb:
      "Serving on the MTA's ACTA committee, advising on how the region's transit system can " +
      "work better for riders with disabilities.",
    highlights: [
      "Advises the MTA on accessibility across subway, bus and paratransit service",
    ],
    skills: ["Transit accessibility", "Disability justice", "Advisory governance"],
  },
  {
    id: "nyc-dot",
    role: "NYMTC 9/11 Memorial Research Fellow",
    org: "New York City Department of Transportation",
    period: "Sep 2025 — Sep 2026",
    location: "New York, NY",
    route: "7",
    station: "NYC DOT",
    blurb:
      "One of six graduate students selected region-wide for NYMTC's September 11th Memorial " +
      "Fellowship. Embedded with NYC DOT's Public Realm Programming team researching public " +
      "realm health and inclusivity.",
    highlights: [
      "Interviewed 30 NYC DOT partners and thematically analysed 655 minutes of conversation",
      "Authored “Public Realm for the People,” a report on building streets designed for every New Yorker",
      "Presented findings to NYC DOT Commissioner Mike Flynn",
      "Joined the Access to Independence Ferry Tour helping New Yorkers with disabilities navigate the ferry system",
    ],
    skills: ["Qualitative research", "Thematic analysis", "Public realm", "Report writing"],
  },
  {
    id: "nj-transit",
    role: "Transportation Planning Intern",
    org: "NJ TRANSIT",
    period: "Jun 2025 — Sep 2025",
    location: "Newark, NJ · Hybrid",
    route: "N",
    station: "NJ TRANSIT",
    blurb:
      "Full-time summer internship with the statewide transit agency, working on transportation " +
      "planning for New Jersey's bus and rail network.",
    highlights: [
      "Supported planning work across NJ TRANSIT's statewide network",
    ],
    skills: ["Transportation planning", "Transit operations"],
  },
  {
    id: "rutgers-iwl",
    role: "Women's Leadership Scholar",
    org: "Institute for Women's Leadership at Rutgers",
    period: "Sep 2023 — May 2025",
    location: "New Brunswick, NJ · On-site",
    route: "1",
    station: "Rutgers IWL",
    blurb:
      "One of eighteen students selected for the IWL Leadership Scholars Program, a two-year " +
      "certificate built around a self-directed Social Action Project.",
    highlights: [
      "Co-created “Mosh and Mingle,” a symposium on third spaces and the New Brunswick DIY basement show scene",
      "Secured over $1,500 in funding and ran a grassroots marketing campaign",
      "Drew roughly 200 students, professors and practitioners across a three-part programme",
    ],
    skills: ["Programme design", "Fundraising", "Third spaces", "Leadership"],
  },
];

export const projects: Project[] = [
  {
    id: "public-realm",
    name: "Public Realm for the People",
    kind: "Research report · NYMTC × NYC DOT",
    year: "2026",
    blurb:
      "A community-centered approach for New York City streets. Built on 30 partner interviews " +
      "and 655 minutes of conversation, it details how Open Street, Plaza and Programming partners " +
      "foster fair access citywide — and offers actionable next steps.",
    tags: ["Thematic analysis", "Public realm", "Equity"],
  },
  {
    id: "janes-walk",
    name: "Disability Justice Through the Ages",
    kind: "Walking tour · Municipal Art Society",
    year: "2026",
    blurb:
      "Two Jane's Walk tours tracing accessibility along 14th Street, from the Gallaudet House and " +
      "the New York Eye and Ear Infirmary to the 14th Street Transit Complex upgrade. Wheelchair " +
      "accessible with ASL interpretation.",
    tags: ["Disability justice", "Wayfinding", "Public history"],
  },
  {
    id: "mosh-and-mingle",
    name: "Mosh and Mingle",
    kind: "Symposium · Rutgers IWL",
    year: "2025",
    blurb:
      "A symposium about third spaces, held inside one. Panel, a “Find Your Third Space” fair with " +
      "six community organisations, and a women-led punk performance — examining how free, accessible " +
      "spaces build belonging for women, queer and POC youth.",
    tags: ["Third spaces", "Placemaking", "Community"],
  },
  {
    id: "wtc-placemaking",
    name: "Flowering Feedback Garden",
    kind: "Placemaking activation · Port Authority",
    year: "2026",
    blurb:
      "The first kids-oriented activation on the World Trade Center Campus — turf squares, Big Blue " +
      "Blocks and Street Lab tables, plus an engagement map that bloomed as families answered what " +
      "they wanted to see on the campus.",
    tags: ["Placemaking", "Engagement", "Public space"],
  },
];

export const education = [
  {
    id: "mcrp",
    school: "Rutgers University — Edward J. Bloustein School of Planning and Public Policy",
    degree: "M.S., City and Regional Planning",
    detail: "Summa cum laude · 4.0 GPA",
    year: "2026",
  },
  {
    id: "ba",
    school: "Rutgers University — Edward J. Bloustein School of Planning and Public Policy",
    degree: "B.A., Planning and Public Policy",
    detail: "3.9 GPA",
    year: "2025",
  },
];

export const honors = [
  {
    id: "aicp",
    name: "Outstanding AICP Planning Student Award",
    issuer: "American Planning Association",
    year: "2026",
  },
  {
    id: "wts",
    name: "WTS NJ Graduate Leadership Scholarship",
    issuer: "WTS New Jersey",
    year: "2025",
  },
  {
    id: "nymtc",
    name: "NYMTC 9/11 Memorial Transportation Fellowship",
    issuer: "NYMTC · 1 of 6 selected region-wide",
    year: "2025",
  },
  {
    id: "redcord",
    name: "Bloustein Urban Planning Red Cord",
    issuer: "Rutgers Bloustein School",
    year: "2026",
  },
];

/** Rendered on the last-stop sign. */
export const terminus = {
  heading: "Last stop",
  body:
    "Thanks for riding. If you're working on streets, transit or public space, I'd love to hear about it.",
  cta: "Get in touch",
};
