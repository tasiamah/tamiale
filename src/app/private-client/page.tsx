import type { Metadata } from "next";

import { PrivateAccess } from "@/components/home/private-access";
import { AppointmentForm } from "@/components/private-client/appointment-form";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Private Client",
  description:
    "A private video fitting with a Tamiale advisor, early access to releases, and a direct line to the house.",
  alternates: { canonical: "/private-client" },
};

const SERVICES = [
  {
    title: "Private video fitting",
    body: "Twenty minutes with an advisor who will look at the frame on you, measure it against a pair you already own and talk through the lens. No obligation, no charge.",
  },
  {
    title: "Early access",
    body: "Releases are offered to the register before they are announced. Editions are small enough that this is the difference between having the choice and reading about it.",
  },
  {
    title: "A direct line",
    body: "One advisor, one thread, for as long as you own the pair. Sizing, service, repairs, and the occasional honest answer that a frame is not right for you.",
  },
  {
    title: "Service and repair",
    body: "Registered pairs are serviced against their serial. The workshop knows which hinge, which finish and which production run without asking you.",
  },
];

export default function PrivateClientPage() {
  return (
    <>
      <header className="gutter border-b border-ivory-hairline py-20 md:py-28">
        <Reveal className="max-w-4xl">
          <p className="eyebrow text-stone">05 — Private Client</p>
          <h1 className="display-hero mt-8 text-balance">
            Someone who knows the frames.
          </h1>
          <p className="body-lg mt-10 max-w-xl text-pretty text-stone-dim">
            Buying eyewear at this price without putting it on your face is a
            reasonable thing to hesitate over. A private client advisor exists
            to remove that hesitation, including by telling you not to buy.
          </p>
        </Reveal>
      </header>

      <section className="gutter py-20 md:py-28">
        <dl className="grid gap-x-12 gap-y-12 border-t border-ivory-hairline pt-12 sm:grid-cols-2">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 60}>
              <dt className="display-md">{service.title}</dt>
              <dd className="mt-4 max-w-md leading-relaxed text-stone-dim">
                {service.body}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <section
        id="contact"
        className="grain scroll-mt-(--header-height) border-t border-obsidian-hairline bg-obsidian text-ivory"
      >
        <div className="gutter grid gap-14 py-24 md:py-32 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="eyebrow text-champagne">Appointments</p>
            <h2 className="display-xl mt-6 text-balance">
              Book a private fitting.
            </h2>
            <p className="body-lg mt-8 max-w-md text-pretty text-ivory/55">
              An advisor will write within one working day to arrange a time in
              your own hours. Sessions run over video; you will need a camera
              and, ideally, a pair of glasses you already like.
            </p>
            <div className="mt-12 flex flex-col gap-2">
              <p className="eyebrow text-ivory/45">Or write directly</p>
              <a
                href={`mailto:${site.email}`}
                className="text-lg text-ivory transition-opacity hover:opacity-60"
              >
                {site.email}
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <AppointmentForm />
          </Reveal>
        </div>
      </section>

      <PrivateAccess />
    </>
  );
}
