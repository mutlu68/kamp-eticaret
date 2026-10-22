"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { ClockIcon } from "@/components/ui/Icons";
import { CAMPAIGN_ENDS_AT } from "@/lib/constants";
import type { Product } from "@/lib/data/types";

/**
 * KAMPANYA BLOĞU — GERÇEK ÇALIŞAN GERİ SAYIM
 *
 * Hidrasyon notu: "şu an" sunucuda ve istemcide farklıdır. Bu yüzden ilk
 * render'da rakamlar yerine tire gösteriliyor, gerçek sayaç yalnızca mount
 * sonrası çalışıyor. Aksi halde her açılışta hydration hatası alınırdı.
 *
 * Kampanya bitince sayaç sıfırlanmıyor, blok "kampanya sona erdi" durumuna
 * geçiyor — yanlış aciliyet yaratmak güveni zedeler.
 */
export function CountdownPromo({ deals }: { deals: Product[] }) {
  const remaining = useCountdown(CAMPAIGN_ENDS_AT);

  return (
    <section id="kampanya" className="bg-ink text-bg">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-bg/10 px-3 py-1.5 text-xs font-semibold">
            <ClockIcon className="text-sm" />
            Sezon sonu indirimi
          </p>

          <h2 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Kış gelmeden ekipmanınızı tamamlayın
          </h2>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-bg/75 sm:text-base">
            Seçili çadır, uyku tulumu ve ocaklarda %30&apos;a varan indirim.
            Stoklar sınırlı, ürünler bitince kampanya kapanır.
          </p>

          {remaining ? (
            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bg/60">
                Kampanyanın bitmesine
              </p>
              <div className="flex gap-2.5">
                <TimeBox value={remaining.days} label="gün" />
                <TimeBox value={remaining.hours} label="saat" />
                <TimeBox value={remaining.minutes} label="dakika" />
                <TimeBox value={remaining.seconds} label="saniye" />
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-bg/60">
                Kampanyanın bitmesine
              </p>
              <div className="flex gap-2.5">
                {["gün", "saat", "dakika", "saniye"].map((label) => (
                  <TimeBox key={label} value={null} label={label} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <ButtonLink href="/urunler?sirala=cok-satan" size="lg">
              İndirimli ürünlere git
            </ButtonLink>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4">
          {deals.slice(0, 4).map((product) => (
            <li key={product.id}>
              <Link
                href={`/urun/${product.slug}`}
                className="group block overflow-hidden rounded-[var(--radius-card)] bg-bg/5 transition-colors hover:bg-bg/10"
              >
                <span className="relative block aspect-4/3 overflow-hidden bg-bg/10">
                  <Image
                    src={product.images[0]}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 45vw, 260px"
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </span>
                <span className="block p-3">
                  <span className="block truncate text-sm font-semibold group-hover:underline">
                    {product.name}
                  </span>
                  <span className="mt-1.5 block">
                    {/* Koyu zemin: rengi Price kendi içinde çeviriyor, dışarıdan
                        toplu bir renk ezmesi yapılmıyor — rozet kendi
                        kontrastını korumalı. */}
                    <Price
                      price={product.price}
                      salePrice={product.salePrice}
                      size="sm"
                      onDark
                    />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TimeBox({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="min-w-[4.2rem] rounded-[var(--radius-card)] bg-bg/10 px-3 py-2.5 text-center">
      <span className="block font-display text-2xl font-bold tabular-nums">
        {value === null ? "--" : String(value).padStart(2, "0")}
      </span>
      <span className="mt-0.5 block text-[0.68rem] uppercase tracking-wide text-bg/60">
        {label}
      </span>
    </div>
  );
}

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Hedef tarihe kalan süre. Sunucuda ve mount öncesi null döner. */
function useCountdown(target: string): Remaining | null {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const endsAt = new Date(target).getTime();

    function tick() {
      const diff = endsAt - Date.now();
      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setRemaining({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff / 3_600_000) % 24),
        minutes: Math.floor((diff / 60_000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [target]);

  return remaining;
}
