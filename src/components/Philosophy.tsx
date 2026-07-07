"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const STEPS = [
  {
    tone: "var(--tone-espresso)",
    label: "Consultation",
    copy: "Before anything touches your hair, we talk — about your week, your maintenance tolerance, what you actually reach for in the morning.",
  },
  {
    tone: "var(--tone-caramel)",
    label: "Color & Cut",
    copy: "We build the shade and shape together, checking in as we go rather than disappearing behind the chair for two hours.",
  },
  {
    tone: "var(--tone-platinum)",
    label: "Finish & Style",
    copy: "You leave knowing how to recreate the finish at home — not just how it looks fresh out of the salon.",
  },
];

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const el = sectionRef.current;
      if (!el) return;

      const items = el.querySelectorAll("[data-step]");
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              items,
              { opacity: 0, y: 28 },
              { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
            );
            io.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      io.observe(el);
      return () => io.disconnect();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--bg-noir)] py-28 sm:py-36"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-16">
        <div className="max-w-2xl">
          <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[var(--copper-light)]">
            <span className="h-px w-8 bg-[var(--copper-light)]" />
            The Process
          </p>

          <h2 className="font-[var(--font-display)] text-4xl italic leading-tight text-[var(--ivory)] sm:text-5xl lg:text-6xl">
            We ask questions before we pick up shears.
          </h2>
        </div>

        {/* Connecting tone line (desktop) */}
        <div className="relative mt-20 hidden lg:block">
          <div
            className="absolute left-0 right-0 top-[14px] h-px"
            style={{
              background:
                "linear-gradient(90deg, var(--tone-espresso), var(--tone-caramel), var(--tone-platinum))",
            }}
          />

          <div className="grid grid-cols-3 gap-12">
            {STEPS.map((step) => (
              <div key={step.label} data-step>
                <span
                  className="relative z-10 block h-7 w-7 rounded-full border-2 border-[var(--bg-noir)] shadow-lg"
                  style={{ backgroundColor: step.tone }}
                />
                <h3 className="mt-6 font-[var(--font-display)] text-2xl text-[var(--ivory)]">
                  {step.label}
                </h3>
                <p className="mt-3 leading-7 text-[var(--ivory-dim)]">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stacked (mobile / tablet) */}
        <div className="mt-16 space-y-10 lg:hidden">
          {STEPS.map((step) => (
            <div key={step.label} data-step className="flex gap-5">
              <span
                className="mt-1.5 h-5 w-5 shrink-0 rounded-full"
                style={{ backgroundColor: step.tone }}
              />
              <div>
                <h3 className="font-[var(--font-display)] text-xl text-[var(--ivory)]">
                  {step.label}
                </h3>
                <p className="mt-2 leading-7 text-[var(--ivory-dim)]">
                  {step.copy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}