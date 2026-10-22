"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { CheckIcon, MailIcon } from "@/components/ui/Icons";
import { WELCOME_DISCOUNT_PERCENT } from "@/lib/constants";

/**
 * E-POSTA KAYDI
 *
 * %10 hoş geldin indirimi karşılığında e-posta toplar.
 *
 * DEMO: form gerçekten bir yere göndermiyor, sadece istemcide başarı durumuna
 * geçiyor. Gerçek entegrasyonda burası bir Server Action'a bağlanır ve
 * e-posta sağlayıcısına (Mailchimp, Resend, Hostinger Reach...) yazılır.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Tarayıcının type="email" doğrulamasına ek olarak basit bir kontrol
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email.trim())) {
      setError("Geçerli bir e-posta adresi girin.");
      return;
    }

    setError(null);
    setSubmitted(true);
  }

  return (
    <section className="container-page pb-16 sm:pb-20">
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-alt">
        <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-stone/10 text-xl text-stone">
              <MailIcon />
            </span>

            <h2 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
              İlk siparişinizde %{WELCOME_DISCOUNT_PERCENT} indirim
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-sage sm:text-base">
              E-posta listemize katılın; indirim kodunuz hemen kutunuza düşsün.
              Ayda en fazla iki e-posta gönderiyoruz, istediğiniz an
              çıkabilirsiniz.
            </p>
          </div>

          {submitted ? (
            <div
              role="status"
              className="flex items-start gap-3 rounded-[var(--radius-card)] border border-stone/25 bg-stone/8 p-5"
            >
              <CheckIcon className="mt-0.5 shrink-0 text-xl text-stone" />
              <div>
                <p className="font-display font-bold text-ink">Kaydınız alındı</p>
                <p className="mt-1 text-sm leading-relaxed text-sage">
                  <strong className="font-semibold text-ink">{email}</strong>{" "}
                  adresine %{WELCOME_DISCOUNT_PERCENT} indirim kodunuzu gönderdik.
                  <span className="mt-1 block text-xs">
                    (Demo: gerçek e-posta gönderilmez.)
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <label htmlFor="bulten-eposta" className="sr-only">
                E-posta adresiniz
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="bulten-eposta"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="ornek@eposta.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "bulten-hata" : undefined}
                  className="h-12 flex-1 rounded-[var(--radius-card)] border border-line bg-surface px-4 text-[0.95rem] text-ink placeholder:text-sage/70 focus:border-ink/30 focus:outline-none"
                />
                <Button type="submit" size="lg" className="sm:w-auto">
                  Kodu Gönder
                </Button>
              </div>

              {error && (
                <p id="bulten-hata" role="alert" className="mt-2 text-sm text-danger">
                  {error}
                </p>
              )}

              <p className="mt-3 text-xs leading-relaxed text-sage">
                Kaydolarak KVKK aydınlatma metnini okuduğunuzu kabul edersiniz.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
