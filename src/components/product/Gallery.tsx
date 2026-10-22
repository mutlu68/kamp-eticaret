"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon, ZoomIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

/**
 * ÜRÜN GÖRSEL GALERİSİ
 *
 * Mobil: parmakla kaydırma (scroll-snap) + nokta göstergesi.
 * Masaüstü: solda dikey thumbnail şeridi, sağda büyük görsel.
 * Zoom: büyük görselin üstünde imleç konumuna göre yakınlaştırma; dokunmatik
 *       cihazlarda devre dışı (hover yok).
 *
 * Kaydırıcı native `overflow-x` ile çalışıyor; JS yalnızca aktif noktayı ve
 * ok butonlarını yönetiyor. Böylece JS yüklenmeden de galeri gezilebiliyor.
 */
export function Gallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const scrollerRef = useRef<HTMLDivElement>(null);

  /** Mobil kaydırmada hangi görselin ortada olduğunu bul. */
  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.max(0, Math.min(images.length - 1, index)));
  }, [images.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  function goTo(index: number) {
    const next = (index + images.length) % images.length;
    setActive(next);
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  }

  function onPointerMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
      {/* Büyük görsel */}
      <div className="relative min-w-0 flex-1">
        {/* Mobil: yatay kaydırmalı şerit. Masaüstü: tek görsel gösterilir. */}
        <div
          ref={scrollerRef}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface-alt lg:hidden"
        >
          {images.map((src, index) => (
            <div key={src} className="relative aspect-4/5 w-full shrink-0 snap-center">
              <Image
                src={src}
                alt={`${productName} — görsel ${index + 1}`}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Masaüstü: seçili görsel + zoom */}
        <div
          onMouseEnter={() => setZooming(true)}
          onMouseLeave={() => setZooming(false)}
          onMouseMove={onPointerMove}
          className="relative hidden aspect-square overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-alt lg:block"
        >
          <Image
            src={images[active]}
            alt={`${productName} — görsel ${active + 1}`}
            fill
            sizes="(max-width: 1280px) 55vw, 640px"
            priority
            className={cn(
              "object-cover transition-transform duration-200",
              zooming && "scale-[1.75]",
            )}
            style={
              zooming ? { transformOrigin: `${origin.x}% ${origin.y}%` } : undefined
            }
          />

          {!zooming && (
            <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1.5 text-xs font-medium text-sage">
              <ZoomIcon className="text-sm" />
              Yakınlaştırmak için üzerine gelin
            </span>
          )}
        </div>

        {/* Mobil oklar ve nokta göstergesi */}
        {images.length > 1 && (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 lg:hidden">
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                aria-label="Önceki görsel"
                className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-lg text-ink shadow-[var(--shadow-lift)]"
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                aria-label="Sonraki görsel"
                className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-lg text-ink shadow-[var(--shadow-lift)]"
              >
                <ChevronRightIcon />
              </button>
            </div>

            {/*
              Nokta göstergesi görsel olarak ince ama dokunma hedefi 24x24 px:
              WCAG 2.2 "Target Size (Minimum)" ölçütü ve Lighthouse'un
              target-size denetimi 6x6 px butonları hata sayıyordu. Butonun
              kendisi büyük, içindeki çizgi küçük.
            */}
            <div className="mt-2 flex justify-center lg:hidden">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`${index + 1}. görsele git`}
                  aria-current={index === active}
                  className="flex h-6 w-6 items-center justify-center"
                >
                  <span
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      index === active ? "w-5 bg-ink" : "w-1.5 bg-sage/40",
                    )}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Masaüstü thumbnail şeridi */}
      {images.length > 1 && (
        <ul className="hidden shrink-0 flex-col gap-2.5 lg:flex">
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`${index + 1}. görseli göster`}
                aria-current={index === active}
                className={cn(
                  "relative block h-20 w-20 overflow-hidden rounded-md border-2 bg-surface-alt transition-colors",
                  index === active
                    ? "border-ink"
                    : "border-transparent hover:border-line",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="80px"
                  loading="lazy"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
