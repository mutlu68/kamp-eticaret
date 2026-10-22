"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Button, ButtonLink } from "@/components/ui/Button";
import { CartIcon, InfoIcon, LockIcon, TruckIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import type { Order, OrderCustomer } from "@/lib/data/types";
import { formatPrice, generateOrderNumber } from "@/lib/format";
import { useCartHydrated } from "@/lib/hooks";
import { getPaymentProvider } from "@/lib/payment/mock";
import type { CardInput } from "@/lib/payment/provider";
import {
  selectSavings,
  selectShipping,
  selectSubtotal,
  useCart,
} from "@/store/cart";

/** Başarı sayfasının siparişi okuduğu anahtar. */
export const LAST_ORDER_KEY = "kamp-rotasi-son-siparis";

type Errors = Partial<Record<string, string>>;

/**
 * TEK SAYFA CHECKOUT
 *
 * Dönüşüm kuralları:
 *  - üyelik zorunlu değil; misafir olarak devam varsayılan ve tek yol
 *    (hesap oluşturma yalnızca isteğe bağlı bir onay kutusu)
 *  - adımlar ayrı sayfalar değil, tek sayfada bölümler
 *  - sipariş özeti masaüstünde sabit, mobilde açılır kapanır
 *
 * Ödeme `PaymentProvider` arayüzü üzerinden çağrılıyor; bugün sahte sağlayıcı
 * bağlı, yarın iyzico/Stripe bağlandığında bu dosya değişmeyecek.
 */
export function CheckoutForm() {
  const router = useRouter();
  const hydrated = useCartHydrated();

  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);

  const subtotal = selectSubtotal(items);
  const shipping = selectShipping(subtotal);
  const savings = selectSavings(items);
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    note: "",
    createAccount: false,
  });

  const [card, setCard] = useState<CardInput>({
    number: "",
    holder: "",
    expiry: "",
    cvc: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Errors = {};

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(form.email.trim()))
      next.email = "Geçerli bir e-posta adresi girin.";
    if (form.phone.replace(/\D/g, "").length < 10)
      next.phone = "Telefon numarasını 10 haneli girin.";
    if (form.firstName.trim().length < 2) next.firstName = "Adınızı girin.";
    if (form.lastName.trim().length < 2) next.lastName = "Soyadınızı girin.";
    if (form.address.trim().length < 10)
      next.address = "Açık adresinizi girin (sokak, bina, daire).";
    if (!form.city.trim()) next.city = "İl girin.";
    if (!form.district.trim()) next.district = "İlçe girin.";

    // Kart alanları — demo doğrulaması, gerçek Luhn kontrolü değil
    if (card.number.replace(/\D/g, "").length < 15)
      next.cardNumber = "Kart numarasını eksiksiz girin.";
    if (card.holder.trim().length < 3)
      next.cardHolder = "Kart üzerindeki ismi girin.";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry))
      next.cardExpiry = "Son kullanma tarihini AA/YY biçiminde girin.";
    if (card.cvc.replace(/\D/g, "").length < 3) next.cardCvc = "CVC girin.";

    setErrors(next);

    // İlk hatalı alana odaklan — mobilde hatayı bulmak zor olmasın
    const firstKey = Object.keys(next)[0];
    if (firstKey) {
      document.getElementById(fieldIdFor(firstKey))?.focus();
      return false;
    }
    return true;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPaymentError(null);

    if (!validate()) return;

    setSubmitting(true);

    const customer: OrderCustomer = {
      email: form.email.trim(),
      phone: form.phone.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      postalCode: form.postalCode.trim(),
      note: form.note.trim() || undefined,
    };

    const result = await getPaymentProvider().createPayment({
      items,
      customer,
      subtotal,
      shipping,
      total,
      card,
    });

    if (result.status === "error") {
      setPaymentError(result.message);
      setSubmitting(false);
      return;
    }

    const order: Order = {
      id: result.transactionId,
      number: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      items,
      subtotal,
      shipping,
      total,
      customer,
      status: "hazirlaniyor",
    };

    // Başarı sayfası siparişi buradan okur. Gerçek uygulamada sipariş
    // veritabanına yazılır ve sayfa sipariş numarasıyla sunucudan çekilir.
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));

    clear();
    router.push("/odeme/basarili");
  }

  // Sepet localStorage'dan okunmadan form gösterilirse "sepetiniz boş"
  // ekranı bir an yanıp söner
  if (!hydrated) {
    return (
      <div className="container-page py-20">
        <p className="text-sm text-sage">Sepetiniz yükleniyor...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-alt text-3xl text-sage">
          <CartIcon />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink">
          Sepetiniz boş
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-sage">
          Ödeme adımına geçebilmek için sepetinize en az bir ürün eklemeniz
          gerekiyor.
        </p>
        <ButtonLink href="/urunler" className="mt-6" size="lg">
          Ürünleri keşfet
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="container-page py-8 lg:py-12">
      <h1 className="mb-8 font-display text-2xl font-bold text-ink sm:text-3xl">
        Siparişi tamamlayın
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-12">
        {/* Mobilde özet formun üstünde */}
        <div className="lg:order-2">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            savings={savings}
          />
        </div>

        <form onSubmit={onSubmit} noValidate className="lg:order-1">
          {/* 1 — İLETİŞİM */}
          <Section step={1} title="İletişim">
            <p className="mb-4 flex items-start gap-2 rounded-[var(--radius-card)] bg-stone/8 p-3 text-xs leading-relaxed text-stone">
              <InfoIcon className="mt-px shrink-0 text-sm" />
              Üye olmadan devam ediyorsunuz. Sipariş takibi için e-posta ve
              telefon bilgisi yeterli.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="odeme-eposta"
                label="E-posta"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(v) => update("email", v)}
                error={errors.email}
              />
              <Field
                id="odeme-telefon"
                label="Telefon"
                type="tel"
                autoComplete="tel"
                placeholder="5XX XXX XX XX"
                value={form.phone}
                onChange={(v) => update("phone", v)}
                error={errors.phone}
              />
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm text-sage">
              <input
                type="checkbox"
                checked={form.createAccount}
                onChange={(e) => update("createAccount", e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[var(--color-ink)]"
              />
              Sonraki siparişlerim için hesap oluşturulsun (isteğe bağlı)
            </label>
          </Section>

          {/* 2 — TESLİMAT */}
          <Section step={2} title="Teslimat">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="odeme-ad"
                label="Ad"
                autoComplete="given-name"
                value={form.firstName}
                onChange={(v) => update("firstName", v)}
                error={errors.firstName}
              />
              <Field
                id="odeme-soyad"
                label="Soyad"
                autoComplete="family-name"
                value={form.lastName}
                onChange={(v) => update("lastName", v)}
                error={errors.lastName}
              />
            </div>

            <div className="mt-4">
              <Field
                id="odeme-adres"
                label="Açık adres"
                autoComplete="street-address"
                multiline
                placeholder="Mahalle, sokak, bina no, daire no"
                value={form.address}
                onChange={(v) => update("address", v)}
                error={errors.address}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Field
                id="odeme-il"
                label="İl"
                autoComplete="address-level1"
                value={form.city}
                onChange={(v) => update("city", v)}
                error={errors.city}
              />
              <Field
                id="odeme-ilce"
                label="İlçe"
                autoComplete="address-level2"
                value={form.district}
                onChange={(v) => update("district", v)}
                error={errors.district}
              />
              <Field
                id="odeme-posta-kodu"
                label="Posta kodu"
                optional
                autoComplete="postal-code"
                value={form.postalCode}
                onChange={(v) => update("postalCode", v)}
              />
            </div>

            <div className="mt-4">
              <Field
                id="odeme-not"
                label="Sipariş notu"
                optional
                multiline
                placeholder="Kapıcıya bırakılabilir, öğleden sonra teslim vb."
                value={form.note}
                onChange={(v) => update("note", v)}
              />
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-4">
              <TruckIcon className="mt-0.5 shrink-0 text-lg text-stone" />
              <div>
                <p className="text-sm font-semibold text-ink">
                  Standart teslimat — {shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}
                </p>
                <p className="mt-0.5 text-xs text-sage">
                  Kargoya verildikten sonra 2 iş günü içinde teslim.
                </p>
              </div>
            </div>
          </Section>

          {/* 3 — ÖDEME */}
          <Section step={3} title="Ödeme" last>
            <p className="mb-4 flex items-start gap-2 rounded-[var(--radius-card)] border border-stone/30 bg-stone/8 p-3 text-xs leading-relaxed text-stone">
              <InfoIcon className="mt-px shrink-0 text-sm" />
              <span>
                <strong className="font-bold">Bu bir demodur.</strong> Gerçek bir
                ödeme alınmaz, kart bilgileriniz hiçbir yere gönderilmez. Test
                için istediğiniz rakamları yazabilirsiniz; reddedilen ödeme
                akışını görmek isterseniz kart numarası olarak
                {" "}
                <code className="rounded bg-stone/15 px-1 py-0.5 font-mono">
                  4000 0000 0000 0002
                </code>{" "}
                girin.
              </span>
            </p>

            <Field
              id="odeme-kart-no"
              label="Kart numarası"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="0000 0000 0000 0000"
              value={card.number}
              onChange={(v) => {
                setCard((c) => ({ ...c, number: formatCardNumber(v) }));
                setErrors((e) => ({ ...e, cardNumber: undefined }));
              }}
              error={errors.cardNumber}
            />

            <div className="mt-4">
              <Field
                id="odeme-kart-sahibi"
                label="Kart üzerindeki isim"
                autoComplete="cc-name"
                value={card.holder}
                onChange={(v) => {
                  setCard((c) => ({ ...c, holder: v }));
                  setErrors((e) => ({ ...e, cardHolder: undefined }));
                }}
                error={errors.cardHolder}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                id="odeme-kart-tarih"
                label="Son kullanma (AA/YY)"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="09/29"
                value={card.expiry}
                onChange={(v) => {
                  setCard((c) => ({ ...c, expiry: formatExpiry(v) }));
                  setErrors((e) => ({ ...e, cardExpiry: undefined }));
                }}
                error={errors.cardExpiry}
              />
              <Field
                id="odeme-kart-cvc"
                label="CVC"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                value={card.cvc}
                onChange={(v) => {
                  setCard((c) => ({ ...c, cvc: v.replace(/\D/g, "").slice(0, 4) }));
                  setErrors((e) => ({ ...e, cardCvc: undefined }));
                }}
                error={errors.cardCvc}
              />
            </div>

            {paymentError && (
              <p
                role="alert"
                className="mt-5 rounded-[var(--radius-card)] border border-danger/30 bg-danger/5 p-3.5 text-sm text-danger"
              >
                {paymentError}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={submitting}
              className="mt-6"
            >
              {submitting
                ? "Ödeme işleniyor..."
                : `${formatPrice(total)} Öde ve Siparişi Tamamla`}
            </Button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-sage">
              <LockIcon className="text-sm" />
              Bilgileriniz 256-bit SSL ile şifrelenir
            </p>
          </Section>
        </form>
      </div>
    </div>
  );
}

/** Numaralı bölüm başlığı — adımlar tek sayfada ama görsel olarak ayrık. */
function Section({
  step,
  title,
  children,
  last,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section className={cn("pb-8", !last && "mb-8 border-b border-line")}>
      <h2 className="mb-5 flex items-center gap-3 font-display text-lg font-bold text-ink">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-sm text-bg">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Etiket + girdi + hata mesajı üçlüsü; hata `aria-describedby` ile bağlı. */
function Field({
  id,
  label,
  value,
  onChange,
  error,
  optional,
  multiline,
  ...props
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  optional?: boolean;
  multiline?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "value" | "onChange">) {
  const errorId = `${id}-hata`;
  const shared = {
    id,
    value,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    className: cn(
      "w-full rounded-[var(--radius-card)] border bg-surface px-3.5 text-[0.95rem] text-ink placeholder:text-sage/60 focus:outline-none",
      multiline ? "py-2.5" : "h-12",
      error ? "border-danger focus:border-danger" : "border-line focus:border-ink/30",
    ),
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {optional && <span className="ml-1 font-normal text-sage">(isteğe bağlı)</span>}
      </label>

      {multiline ? (
        <textarea rows={3} {...shared} />
      ) : (
        <input {...props} {...shared} />
      )}

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Hata anahtarını girdi id'sine çevirir (odaklama için). */
function fieldIdFor(key: string): string {
  const map: Record<string, string> = {
    email: "odeme-eposta",
    phone: "odeme-telefon",
    firstName: "odeme-ad",
    lastName: "odeme-soyad",
    address: "odeme-adres",
    city: "odeme-il",
    district: "odeme-ilce",
    cardNumber: "odeme-kart-no",
    cardHolder: "odeme-kart-sahibi",
    cardExpiry: "odeme-kart-tarih",
    cardCvc: "odeme-kart-cvc",
  };
  return map[key] ?? key;
}

function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}
