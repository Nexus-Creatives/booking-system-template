"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const WORKS = [
  {
    label: "Balayage",
    image:
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Precision Bob",
    image:
      "https://images.unsplash.com/photo-1595475884562-073c30d45670?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Copper Gloss",
    image:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Soft Curtain",
    image:
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Platinum Ice",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
  },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const el = sectionRef.current;
      if (!el) return;

      const cards = el.querySelectorAll("[data-card]");
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }
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
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative overflow-hidden bg-[var(--bg-noir)] py-28 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-16">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[var(--copper-light)]">
              <span className="h-px w-8 bg-[var(--copper-light)]" />
              The Work
            </p>
            <h2 className="font-[var(--font-display)] text-4xl italic text-[var(--ivory)] sm:text-5xl">
              From the chair
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-[var(--ivory-dim)]">
            A handful of recent color and cut work — swipe through, or come
            see the rest in the studio.
          </p>
        </div>
      </div>

      <div className="scrollbar-none mx-auto flex max-w-7xl gap-6 overflow-x-auto px-6 pb-6 sm:px-8 lg:px-16">
        {WORKS.map((work) => (
          <div
            key={work.label}
            data-card
            className="group relative h-[380px] w-[240px] shrink-0 overflow-hidden rounded-t-[100px] rounded-b-2xl border border-[var(--ivory)]/10"
          >
            <div
              className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${work.image}')` }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--bg-noir)]/90 to-transparent p-5 pt-16">
              <span className="text-sm uppercase tracking-[0.2em] text-[var(--ivory)]">
                {work.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}