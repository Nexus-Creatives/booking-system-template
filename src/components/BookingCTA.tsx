"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function BookingCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const el = sectionRef.current;
      if (!el) return;

      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              el.querySelectorAll("[data-cta]"),
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }
            );
            io.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      io.observe(el);
      return () => io.disconnect();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--copper)] py-28 sm:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.08]" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center sm:px-8">
        <span
          data-cta
          className="mb-8 h-3 w-3 rounded-full"
          style={{ backgroundColor: "var(--tone-platinum)" }}
        />

        <h2
          data-cta
          className="font-[var(--font-display)] text-4xl italic leading-[1.05] text-[var(--bg-noir)] sm:text-6xl lg:text-7xl"
        >
          Ready for a change?
        </h2>

        <p
          data-cta
          className="mt-6 max-w-md text-lg leading-8 text-[var(--bg-noir)]/70"
        >
          Chairs open most weekdays within 48 hours. Tell us what you&apos;re
          thinking and we&apos;ll take it from there.
        </p>

        <Link
          data-cta
          href="/book"
          className="mt-10 rounded-full bg-[var(--bg-noir)] px-9 py-4 font-medium text-[var(--ivory)] transition-all duration-500 hover:-translate-y-1 hover:bg-[var(--bg-noir-soft)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
        >
          Book Your Chair
        </Link>
      </div>
    </section>
  );
}
