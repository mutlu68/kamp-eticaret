"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Hiç değişmeyen bir "dış kaynak" — abonelik gerçekten gerekmiyor. */
const neverChanges = () => () => {};

/**
 * Bileşen istemcide mount olduktan sonra true döner.
 *
 * localStorage, tarih/saat gibi sunucuda karşılığı olmayan her şey bu bayrağın
 * arkasına alınmalı. Aksi halde sunucu HTML'i ile istemcinin ilk render'ı
 * ayrışır ve React hydration hatası verir.
 */
export function useMounted(): boolean {
  // useSyncExternalStore, sunucu ve istemci için AYRI değer döndürebilen tek
  // React API'si: sunucuda false, hidrasyondan sonra true. useEffect + setState
  // ile aynı sonucu verir ama fazladan render zinciri kurmaz.
  return useSyncExternalStore(
    neverChanges,
    () => true, // istemci
    () => false, // sunucu ve hidrasyon anı
  );
}

/** Sepet localStorage'dan okunana kadar false. */
export const useCartHydrated = useMounted;

/**
 * Drawer/modal açıkken arka planın kaymasını engeller.
 * Kaydırma çubuğunun kaybolmasıyla oluşan yatay sıçramayı da telafi eder.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}

/**
 * Modal/drawer içinde klavye odağını hapseder ve Esc ile kapanmayı bağlar.
 * Kapanınca odak, açan öğeye geri döner.
 */
export function useFocusTrap(
  active: boolean,
  onClose: () => void,
): React.RefObject<HTMLDivElement | null> {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    const focusables = () =>
      Array.from(
        container?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null);

    // Açılınca ilk odaklanabilir öğeye geç
    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [active, onClose]);

  return containerRef;
}

/**
 * Bir öğe görünür alandan çıktığında true döner.
 * Ürün sayfasındaki sticky "Sepete Ekle" barı bunu kullanıyor: asıl buton
 * ekrandan kaybolunca alt bar beliriyor.
 */
export function useScrolledPast(
  ref: React.RefObject<HTMLElement | null>,
): boolean {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Öğe yukarıda kaldıysa (aşağı scroll edildiyse) bar görünsün
        setPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return passed;
}

/** Sayfa belirli bir mesafe kaydırıldığında true — sticky header küçültme. */
export function useScrolled(offset = 24): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > offset);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return scrolled;
}

/** Dışına tıklandığında çalışır — arama önerileri ve mega menü kapanışı. */
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
  active = true,
): void {
  useEffect(() => {
    if (!active) return;

    function onPointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [ref, handler, active]);
}

/** Yazarken her tuşta değil, duraklayınca çalışsın — canlı arama için. */
export function useDebouncedValue<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
