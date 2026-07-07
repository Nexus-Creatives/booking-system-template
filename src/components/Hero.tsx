"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const maskRefs = useRef<HTMLSpanElement[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const lines = ["YOUR HAIR,", "REWRITTEN"];

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      { reduce: "(prefers-reduced-motion: reduce)", full: "(prefers-reduced-motion: no-preference)" },
      (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean };
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.from(maskRefs.current, {
          yPercent: reduce ? 0 : 110,
          duration: reduce ? 0.3 : 1,
          stagger: reduce ? 0 : 0.12,
        })
          .from(
            subtitleRef.current,
            { opacity: 0, y: reduce ? 0 : 20, duration: 0.7 },
            "-=0.5"
          )
          .from(
            buttonRef.current,
            { opacity: 0, y: reduce ? 0 : 16, duration: 0.6 },
            "-=0.4"
          )
          .from(
            tagRef.current,
            {
              opacity: 0,
              rotate: reduce ? -6 : -22,
              y: reduce ? 0 : -24,
              duration: reduce ? 0.3 : 0.9,
              ease: "back.out(1.6)",
            },
            "-=0.6"
          );

        if (!reduce) {
          gsap.to(bgRef.current, { scale: 1, duration: 12, ease: "none" });

          gsap.to(scrollRef.current, {
            y: 16,
            repeat: -1,
            yoyo: true,
            duration: 1.3,
            ease: "power1.inOut",
          });

          gsap.to(tagRef.current, {
            rotate: "+=3",
            repeat: -1,
            yoyo: true,
            duration: 3.5,
            ease: "sine.inOut",
          });
        }

        return () => tl.kill();
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen items-end overflow-hidden bg-[var(--bg-noir)]"
    >
      {/* Full-bleed photo */}
      <div
        ref={bgRef}
        className="absolute inset-0 scale-110 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1800&q=80')",
        }}
      />

      {/* Duotone overlay for contrast + mood */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-noir)] via-[var(--bg-noir)]/60 to-[var(--bg-noir)]/10" />
      <div className="absolute inset-0 bg-[var(--copper)] mix-blend-color opacity-[0.12]" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.07]" />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 z-20 flex w-full items-center justify-between px-6 py-7 sm:px-8 lg:px-16">
        <span className="font-[var(--font-display)] text-2xl italic tracking-wide text-[var(--ivory)] sm:text-3xl">
          Lumière
        </span>

        <Link
          href="/book"
          className="rounded-full border border-[var(--ivory)]/15 bg-[var(--ivory)]/[0.06] px-5 py-2.5 text-sm font-medium text-[var(--ivory)] backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-[var(--copper)] hover:bg-[var(--copper)] hover:text-[var(--bg-noir)] sm:px-6 sm:py-3"
        >
          Book Now
        </Link>
      </nav>

      {/* Shade tag — pinned to the photo like a paint-swatch label */}
      <div
        ref={tagRef}
        className="absolute right-6 top-28 z-20 flex origin-top-right flex-col items-start gap-2 rounded-xl border border-[var(--ivory)]/15 bg-[var(--bg-noir)]/70 px-4 py-3 backdrop-blur-md sm:right-10 sm:top-32"
      >
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[var(--ivory-dim)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--copper-light)]" />
          Trending This Month
        </span>
        <span className="flex items-center gap-2">
          <span
            className="h-4 w-4 rounded-full border border-[var(--ivory)]/30"
            style={{ backgroundColor: "var(--tone-copper)" }}
          />
          <span className="font-[var(--font-display)] text-lg italic text-[var(--ivory)]">
            Copper Gloss
          </span>
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 sm:px-8 lg:px-16 lg:pb-28">
        <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[var(--copper-light)]">
          <span className="h-px w-8 bg-[var(--copper-light)]" />
          Color · Cut · Style
        </p>

        <h1 className="font-[var(--font-display)] text-[3rem] font-medium leading-[0.95] text-[var(--ivory)] sm:text-[5rem] xl:text-[7.5rem]">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <span
                ref={(el) => {
                  if (el) maskRefs.current[i] = el;
                }}
                className="block"
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          className="mt-8 max-w-md text-base leading-8 text-[var(--ivory-dim)] sm:text-lg"
        >
          Every appointment starts with a conversation, not a chair. We
          listen first, then match a color and cut to how you actually
          live — not a photo you found online.
        </p>

        <div ref={buttonRef} className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/book"
            className="rounded-full bg-[var(--copper)] px-7 py-4 font-medium text-[var(--bg-noir)] transition-all duration-500 hover:-translate-y-1 hover:bg-[var(--copper-light)] hover:shadow-[0_20px_40px_-15px_rgba(193,112,60,0.6)]"
          >
            Book a Chair
          </Link>

          <Link
            href="#work"
            className="rounded-full border border-[var(--ivory)]/15 px-7 py-4 font-medium text-[var(--ivory)] transition-all duration-500 hover:border-[var(--copper-light)] hover:text-[var(--copper-light)]"
          >
            See the Work
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center sm:flex"
      >
        <span className="mb-3 text-xs uppercase tracking-[0.4em] text-[var(--ivory-dim)]">
          Scroll
        </span>
        <div className="h-16 w-px overflow-hidden bg-[var(--ivory)]/15">
          <div className="h-8 w-full bg-[var(--copper)]" />
        </div>
      </div>
    </section>
  );
}