"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

type Service = {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
};

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem === 0 ? `${hrs} hr` : `${hrs} hr ${rem} min`;
}

function formatPrice(price: number) {
  return `₱${price.toLocaleString("en-PH")}`;
}

export default function Services({ services }: { services: Service[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const el = sectionRef.current;
      if (!el) return;

      const rows = el.querySelectorAll("[data-row]");
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              rows,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power2.out" }
            );
            io.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      io.observe(el);
      return () => io.disconnect();
    });
    return () => mm.revert();
  }, [services]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden bg-[var(--bg-noir-soft,_#221a15)] py-28 sm:py-36"
    >
      <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-16">
        <div className="mb-16 text-center">
          <p className="mb-6 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[var(--copper-light)]">
            <span className="h-px w-8 bg-[var(--copper-light)]" />
            The Menu
            <span className="h-px w-8 bg-[var(--copper-light)]" />
          </p>
          <h2 className="font-[var(--font-display)] text-4xl italic text-[var(--ivory)] sm:text-5xl">
            Services & Pricing
          </h2>
        </div>

        <div className="divide-y divide-[var(--ivory)]/10">
          {services.map((service) => (
            <div
              key={service.id}
              data-row
              className="group flex items-baseline gap-4 py-6"
            >
              <div className="flex flex-col">
                <span className="font-[var(--font-display)] text-xl font-medium text-[var(--ivory,_#f3e9dd)] transition-colors duration-300 group-hover:text-[var(--copper-light)] sm:text-2xl">
                  {service.name}
                </span>
                <span className="mt-1 text-xs uppercase tracking-[0.15em] text-[var(--ivory-dim)]">
                  {formatDuration(service.duration_minutes)}
                </span>
              </div>

              <span className="flex-1 border-b border-dotted border-[var(--ivory)]/20 translate-y-[-6px]" />

              <span className="shrink-0 font-[var(--font-display)] text-xl text-[var(--copper-light)] sm:text-2xl">
                {formatPrice(service.price)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/book"
            className="inline-block rounded-full bg-[var(--copper)] px-8 py-4 font-medium text-[var(--bg-noir)] transition-all duration-500 hover:-translate-y-1 hover:bg-[var(--copper-light)] hover:shadow-[0_20px_40px_-15px_rgba(193,112,60,0.6)]"
          >
            Book a Chair
          </Link>
        </div>
      </div>
    </section>
  );
}