"use client";

import { useId, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

import { ChevronDownIcon } from "./Icons";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

/**
 * Akordeon — ürün detayında (açıklama / teknik özellikler / kargo-iade) ve
 * SSS sayfasında kullanılıyor.
 *
 * Erişilebilirlik: başlıklar gerçek <button>, aria-expanded ve aria-controls
 * bağlı. İçerik kapalıyken DOM'da kalıyor ama `hidden` ile gizleniyor; bu
 * sayede tarayıcı içi arama (Ctrl+F) yerine SEO tarafında da metin okunabilir
 * kalıyor.
 */
export function Accordion({
  items,
  defaultOpenId,
  className,
}: {
  items: AccordionItem[];
  /** Açık başlasın istenen bölüm; verilmezse ilk bölüm açılır. */
  defaultOpenId?: string;
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(
    defaultOpenId ?? items[0]?.id ?? null,
  );
  const baseId = useId();

  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-button`;

        return (
          <div key={item.id}>
            {/*
              Başlık seviyesi h2: akordeon her iki kullanımında da (ürün
              detayındaki bilgi bölümleri, SSS sayfası) doğrudan h1'in altında
              duruyor. h3 kullanıldığında Lighthouse "heading-order" denetimi
              h1 → h3 atlamasını hata olarak işaretliyordu.
            */}
            <h2>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left font-display text-[1.05rem] font-semibold text-ink transition-colors hover:text-sage"
              >
                {item.title}
                <ChevronDownIcon
                  className={cn(
                    "shrink-0 text-lg text-sage transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </h2>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-5 text-[0.95rem] leading-relaxed text-sage"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
