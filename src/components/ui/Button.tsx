import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * BUTON
 *
 * >>> TURUNCU KURALI <<<
 * `variant="primary"` sitedeki TEK turuncu (--color-cta) yüzeydir. Kor
 * turuncusu başka hiçbir bileşende kullanılmaz — tek istisna indirim rozeti
 * (bkz. Badge variant="discount"). Amaç: kullanıcı sayfada turuncu gördüğünde
 * "tıklanacak yer burası" diye düşünsün. Yeni bir turuncu yüzey eklemeden
 * önce bu kuralı hatırla.
 */
type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-card)] font-semibold " +
  "transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  // TEK turuncu yüzey
  primary:
    "bg-cta text-white hover:bg-cta-dark active:bg-cta-dark focus-visible:outline-cta",
  secondary:
    "bg-surface text-ink border border-line hover:border-ink/40 hover:bg-surface-alt",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
  dark: "bg-ink text-bg hover:bg-ink/90",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-14 px-7 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
}

/** Görsel olarak butonla aynı, semantik olarak bağlantı. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  href,
  children,
  ...props
}: CommonProps & { href: string } & Omit<
    React.ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
