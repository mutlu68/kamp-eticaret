"use client";

import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { PAGE_SIZE } from "@/lib/constants";

/**
 * "DAHA FAZLA YÜKLE" IZGARASI
 *
 * Dönüşüm kuralı: sonsuz kaydırma yok. Sonsuz kaydırma footer'a ulaşmayı
 * imkânsız kılar ve kullanıcının "listenin neresindeyim" hissini bozar;
 * açık bir buton kontrolü kullanıcıda bırakır.
 *
 * Kartlar sunucuda render edilip buraya `children` olarak geçiliyor — bu
 * bileşen yalnızca kaç tanesinin görüneceğini yönetiyor, ürün verisinin
 * kendisi istemciye inmiyor.
 */
export function LoadMoreGrid({ children }: { children: ReactNode[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Filtre değişince (sonuç sayısı değişir) listeyi baştan başlat.
  // useEffect yerine render sırasında ayarlama deseni: React bu durumu aynı
  // geçişte yakalar, ekrana bir kez fazladan boyanmış liste düşmez.
  const [lastCount, setLastCount] = useState(children.length);
  if (lastCount !== children.length) {
    setLastCount(children.length);
    setVisible(PAGE_SIZE);
  }

  const shown = children.slice(0, visible);
  const remaining = children.length - shown.length;

  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {shown.map((child, index) => (
          <li key={index}>{child}</li>
        ))}
      </ul>

      {remaining > 0 && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-sm text-sage" aria-live="polite">
            {children.length} üründen {shown.length} tanesi gösteriliyor
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Daha Fazla Yükle ({remaining})
          </Button>
        </div>
      )}
    </div>
  );
}
