"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "./Icons";

/**
 * Yatay kaydırmalı karusel.
 *
 * Mobilde parmakla kaydırma (scroll-snap), masaüstünde ok butonları.
 * JavaScript devre dışı kalsa bile içerik kaydırılabilir kalır — oklar yalnızca
 * bir kolaylık katmanı. Bu yüzden slider kütüphanesi kullanılmadı: hem bundle
 * hem erişilebilirlik açısından native scroll daha iyi.
 */
export function Carousel({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "Tümünü gör",
  children,
  className,
  itemClassName = "w-[72vw] max-w-[300px] sm:w-[300px]",
}: {
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  children: ReactNode[];
  className?: string;
  /** Her öğenin genişliği — kart tipine göre değiştirilebilir. */
  itemClassName?: string;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  function scrollByPage(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  }

  const arrowClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-lg text-ink transition-colors hover:border-ink/40 disabled:opacity-30 disabled:hover:border-line";

  return (
    <div className={className}>
      {(title || viewAllHref) && (
        <div className="container-page mb-6 flex items-end justify-between gap-4">
          <div>
            {title && (
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1.5 max-w-xl text-sm text-sage">{subtitle}</p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="hidden items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:underline sm:inline-flex"
              >
                {viewAllLabel}
                <ArrowRightIcon />
              </Link>
            )}
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => scrollByPage(-1)}
                disabled={atStart}
                aria-label="Önceki ürünler"
                className={arrowClass}
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                onClick={() => scrollByPage(1)}
                disabled={atEnd}
                aria-label="Sonraki ürünler"
                className={arrowClass}
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      <ul
        ref={scrollerRef}
        className="carousel-bleed scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:gap-5"
      >
        {children.map((child, index) => (
          <li key={index} className={cn("shrink-0 snap-start", itemClassName)}>
            {child}
          </li>
        ))}
        {/* Sonda nefes payı — son kart kenara yapışmasın */}
        <li aria-hidden="true" className="w-px shrink-0" />
      </ul>

      {viewAllHref && (
        <div className="container-page mt-5 sm:hidden">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4"
          >
            {viewAllLabel}
            <ArrowRightIcon />
          </Link>
        </div>
      )}
    </div>
  );
}
