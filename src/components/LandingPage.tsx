"use client";

import Link from "next/link";
import Hero from "./Hero";
import Philosophy from "./Philosophy";
import Services from "./Services";
import Gallery from "./Gallery";
import BookingCTA from "./BookingCTA";

type Service = {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
};

export default function LandingPage({
  services,
}: {
  services: Service[];
}) {
  return (
    <main className="relative overflow-hidden bg-[var(--bg-noir)]">
      {/* Hero */}
      <Hero />

      {/* Philosophy */}
      <Philosophy />

      {/* Services */}
      <Services services={services} />

      {/* Gallery */}
      <Gallery />

      {/* CTA */}
      <BookingCTA />

      {/* Footer */}
      <footer className="relative overflow-hidden bg-[var(--bg-noir-soft)] py-20 text-[var(--ivory)]">
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.05]" />
        <div className="absolute -left-32 bottom-0 h-[360px] w-[360px] rounded-full bg-[var(--copper)]/10 blur-[130px]" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-8 lg:flex-row lg:items-end lg:justify-between lg:px-16">
          <div>
            <h2 className="font-[var(--font-display)] text-5xl italic text-[var(--copper-light)]">
              Lumière
            </h2>

            <p className="mt-5 max-w-md leading-8 text-[var(--ivory-dim)]">
              A hair studio built around a conversation first, a cut second —
              color and craft matched to how you actually live.
            </p>

            <Link
              href="/book"
              className="mt-8 inline-block rounded-full bg-[var(--copper)] px-6 py-3 text-sm font-medium text-[var(--bg-noir)] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[var(--copper-light)]"
            >
              Book a Chair
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm text-[var(--ivory-dim)]">
            <div>
              <h3 className="mb-4 font-semibold text-[var(--ivory)]">
                Visit
              </h3>

              <p>Batangas City</p>
              <p>Philippines</p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-[var(--ivory)]">
                Hours
              </h3>

              <p>Mon – Sat</p>
              <p>9:00 AM – 7:00 PM</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-20 max-w-7xl border-t border-[var(--ivory)]/10 px-8 pt-8 text-sm text-[var(--ivory-dim)]/70 lg:px-16">
          © {new Date().getFullYear()} Lumière Hair Studio. All rights
          reserved.
        </div>
      </footer>
    </main>
  );
}