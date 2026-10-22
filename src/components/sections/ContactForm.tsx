"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

/**
 * İLETİŞİM FORMU
 *
 * DEMO: mesaj gerçekten gönderilmez, istemcide başarı durumuna geçer.
 * Gerçek kullanımda bir Server Action ile e-posta servisine bağlanır ve
 * mutlaka sunucu tarafında yeniden doğrulanır — istemci doğrulaması yalnızca
 * kullanıcı deneyimi içindir, güvenlik sınırı değildir.
 */
export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Adınızı girin.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(form.email.trim()))
      next.email = "Geçerli bir e-posta adresi girin.";
    if (form.message.trim().length < 10)
      next.message = "Mesajınızı biraz daha ayrıntılı yazın.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSent(true);
  }

  if (sent) {
    return (
      <div
        role="status"
        className="flex h-full flex-col items-start justify-center rounded-[var(--radius-card)] border border-line bg-surface p-8"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone/12 text-xl text-stone">
          <CheckIcon />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold text-ink">
          Mesajınız alındı
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-sage">
          <strong className="font-semibold text-ink">{form.name}</strong>, en geç
          bir iş günü içinde{" "}
          <strong className="font-semibold text-ink">{form.email}</strong>{" "}
          adresine dönüş yapacağız.
        </p>
        <p className="mt-3 text-xs text-sage">
          (Demo: gerçek bir mesaj gönderilmedi.)
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8"
    >
      <h2 className="font-display text-xl font-bold text-ink">Mesaj gönderin</h2>

      <div className="mt-6 space-y-4">
        <TextField
          id="iletisim-ad"
          label="Adınız"
          value={form.name}
          onChange={(v) => update("name", v)}
          error={errors.name}
          autoComplete="name"
        />
        <TextField
          id="iletisim-eposta"
          label="E-posta"
          type="email"
          value={form.email}
          onChange={(v) => update("email", v)}
          error={errors.email}
          autoComplete="email"
        />
        <TextField
          id="iletisim-konu"
          label="Konu"
          optional
          value={form.subject}
          onChange={(v) => update("subject", v)}
        />
        <TextField
          id="iletisim-mesaj"
          label="Mesajınız"
          multiline
          value={form.message}
          onChange={(v) => update("message", v)}
          error={errors.message}
        />
      </div>

      <Button type="submit" size="lg" fullWidth className="mt-6">
        Gönder
      </Button>

      <p className="mt-3 text-xs leading-relaxed text-sage">
        Formu göndererek KVKK aydınlatma metnini okuduğunuzu kabul edersiniz.
      </p>
    </form>
  );
}

function TextField({
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
      "w-full rounded-[var(--radius-card)] border bg-bg px-3.5 text-[0.95rem] text-ink placeholder:text-sage/60 focus:outline-none",
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

      {multiline ? <textarea rows={5} {...shared} /> : <input {...props} {...shared} />}

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
