"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

import { CartButton } from "@/components/cart/CartButton";
import { Drawer } from "@/components/ui/Drawer";
import {
  ChevronDownIcon,
  CloseIcon,
  LogoMark,
  MenuIcon,
  SearchIcon,
} from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { STORE_NAME } from "@/lib/constants";
import type { Category } from "@/lib/data/types";
import { useClickOutside, useScrolled } from "@/lib/hooks";

import { SearchBox } from "./SearchBox";

/**
 * STICKY HEADER
 *
 * Scroll edilince yükseklik küçülüyor ve ince bir kenarlık beliriyor — ekranın
 * üstünde kalıcı olarak yer kaplamadan sepet ve arama her an erişilebilir
 * kalıyor (mobilde dönüşüm için kritik).
 *
 * Kategoriler mega menüsü hem hover hem klavye (Enter/Space) ile açılıyor;
 * Esc ve dışına tıklama kapatıyor.
 */
export function Header({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<string, number>;
}) {
  const scrolled = useScrolled(24);
  const pathname = usePathname();

  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const megaRef = useRef<HTMLDivElement>(null);
  useClickOutside(megaRef, () => setMegaOpen(false), megaOpen);

  // Sayfa değişince açık kalan panelleri kapat.
  // Render sırasında ayarlama deseni: useEffect ile yapılsaydı yeni sayfa bir
  // kare boyunca menü açık halde görünürdü.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMegaOpen(false);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }

  const navLinks = [
    { href: "/urunler", label: "Tüm Ürünler" },
    { href: "/urunler?sirala=cok-satan", label: "Çok Satanlar" },
    { href: "/kargo-iade", label: "Kargo & İade" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-bg/95 backdrop-blur transition-[height,border-color] duration-200",
        scrolled ? "border-line" : "border-transparent",
      )}
    >
      <div
        className={cn(
          "container-page flex items-center gap-3 transition-[height] duration-200",
          scrolled ? "h-[var(--spacing-header-sm)]" : "h-[var(--spacing-header)]",
        )}
      >
        {/* Mobil menü */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Menüyü aç"
          className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full text-[1.35rem] text-ink transition-colors hover:bg-ink/5 lg:hidden"
        >
          <MenuIcon />
        </button>

        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-ink"
          aria-label={`${STORE_NAME} ana sayfa`}
        >
          <LogoMark className="text-[1.6rem]" />
          <span className="font-display text-lg font-bold tracking-tight sm:text-xl">
            {STORE_NAME}
          </span>
        </Link>

        {/* Masaüstü gezinme */}
        <nav
          aria-label="Ana menü"
          className="ml-4 hidden items-center gap-1 lg:flex"
          ref={megaRef}
        >
          <button
            type="button"
            aria-expanded={megaOpen}
            aria-controls="mega-menu"
            onClick={() => setMegaOpen((v) => !v)}
            onMouseEnter={() => setMegaOpen(true)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5",
              megaOpen && "bg-ink/5",
            )}
          >
            Kategoriler
            <ChevronDownIcon
              className={cn("text-base transition-transform", megaOpen && "rotate-180")}
            />
          </button>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
            >
              {link.label}
            </Link>
          ))}

          {megaOpen && (
            <MegaMenu
              categories={categories}
              counts={counts}
              onClose={() => setMegaOpen(false)}
            />
          )}
        </nav>

        {/* Masaüstü arama */}
        <div className="ml-auto hidden max-w-sm flex-1 md:block">
          <SearchBox />
        </div>

        <div className="ml-auto flex items-center gap-0.5 md:ml-2">
          <button
            type="button"
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Arama aç"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[1.3rem] text-ink transition-colors hover:bg-ink/5 md:hidden"
          >
            <SearchIcon />
          </button>
          <CartButton />
        </div>
      </div>

      {/* Mobil arama paneli */}
      {mobileSearchOpen && (
        <div className="border-t border-line bg-bg px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <SearchBox
              autoFocus
              className="flex-1"
              onNavigate={() => setMobileSearchOpen(false)}
            />
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              aria-label="Aramayı kapat"
              className="flex h-11 w-11 items-center justify-center rounded-full text-lg text-sage"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
        counts={counts}
        navLinks={navLinks}
      />
    </header>
  );
}

/** Masaüstü mega menü paneli — tüm kategoriler görselli. */
function MegaMenu({
  categories,
  counts,
  onClose,
}: {
  categories: Category[];
  counts: Record<string, number>;
  onClose: () => void;
}) {
  return (
    <div
      id="mega-menu"
      onMouseLeave={onClose}
      className="absolute left-0 right-0 top-full border-y border-line bg-bg shadow-[var(--shadow-lift)] [animation:fade-in_140ms_ease-out]"
    >
      <div className="container-page grid grid-cols-4 gap-5 py-7">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/kategori/${category.slug}`}
            className="group flex gap-3 rounded-[var(--radius-card)] p-2 transition-colors hover:bg-surface-alt"
          >
            <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md bg-surface-alt">
              <Image
                src={category.image}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-sm font-semibold text-ink group-hover:underline">
                {category.name}
              </span>
              <span className="block text-xs text-sage">
                {counts[category.id] ?? 0} ürün
              </span>
            </span>
          </Link>
        ))}

        <div className="col-span-1 rounded-[var(--radius-card)] bg-stone/10 p-4">
          <p className="font-display text-sm font-bold text-stone">
            Sezon indirimi sürüyor
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-stone/80">
            Seçili çadır ve uyku tulumlarında %30&apos;a varan indirim.
          </p>
          <Link
            href="/urunler?sirala=cok-satan"
            className="mt-3 inline-block text-xs font-semibold text-ink underline underline-offset-4"
          >
            Kampanyayı gör
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Mobil menü — yandan açılan panel. */
function MobileMenu({
  open,
  onClose,
  categories,
  counts,
  navLinks,
}: {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  counts: Record<string, number>;
  navLinks: { href: string; label: string }[];
}) {
  return (
    <Drawer open={open} onClose={onClose} title="Menü">
      <nav aria-label="Mobil menü" className="px-5 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sage">
          Kategoriler
        </p>
        <ul className="mb-6 divide-y divide-line">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/kategori/${category.slug}`}
                onClick={onClose}
                className="flex items-center justify-between py-3 text-[0.95rem] font-semibold text-ink"
              >
                {category.name}
                <span className="text-xs font-normal text-sage">
                  {counts[category.id] ?? 0}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sage">
          Keşfet
        </p>
        <ul className="divide-y divide-line">
          {[...navLinks, { href: "/sss", label: "Sıkça Sorulan Sorular" }, { href: "/hakkimizda", label: "Hakkımızda" }, { href: "/iletisim", label: "İletişim" }].map(
            (link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block py-3 text-[0.95rem] font-semibold text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>
    </Drawer>
  );
}
