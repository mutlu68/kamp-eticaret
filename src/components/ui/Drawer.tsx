"use client";

import { createPortal } from "react-dom";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { useFocusTrap, useLockBodyScroll, useMounted } from "@/lib/hooks";

import { CloseIcon } from "./Icons";

/**
 * Yandan (veya mobilde alttan) açılan panel.
 *
 * Sepet, kategori filtreleri ve mobil menü bunu kullanıyor.
 *
 * Erişilebilirlik: role="dialog" + aria-modal, odak panelin içine hapsediliyor,
 * Esc kapatıyor, kapanınca odak açan butona dönüyor (useFocusTrap).
 * Panel body'ye portal ediliyor ki sayfadaki hiçbir transform/overflow kuralı
 * konumlandırmayı bozmasın.
 */
export function Drawer({
  open,
  onClose,
  title,
  side = "right",
  children,
  footer,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  /** "bottom" mobil filtre paneli için — alttan yukarı açılır. */
  side?: "right" | "bottom";
  children: ReactNode;
  /** Panelin altına sabitlenen alan (sepet toplamı, "Uygula" butonu). */
  footer?: ReactNode;
  labelledBy?: string;
}) {
  const mounted = useMounted();
  const panelRef = useFocusTrap(open, onClose);
  useLockBodyScroll(open);

  // Portal sadece istemcide kurulabilir
  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50" aria-hidden={false}>
      {/* Karartma — tıklayınca kapanır */}
      <button
        type="button"
        aria-label="Paneli kapat"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/40 backdrop-blur-[1px] [animation:fade-in_180ms_ease-out]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : title}
        aria-labelledby={labelledBy}
        className={cn(
          "absolute flex flex-col bg-bg shadow-[var(--shadow-pop)]",
          side === "right"
            ? "right-0 top-0 h-full w-full max-w-md [animation:drawer-in_240ms_cubic-bezier(0.32,0.72,0,1)]"
            : "bottom-0 left-0 max-h-[88vh] w-full rounded-t-2xl [animation:sheet-up_260ms_cubic-bezier(0.32,0.72,0,1)]",
        )}
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="-mr-1.5 flex h-9 w-9 items-center justify-center rounded-full text-lg text-sage transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-line bg-surface px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
