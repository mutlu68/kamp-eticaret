import Link from "next/link";

import { LogoMark, MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";
import { STORE_EMAIL, STORE_NAME, STORE_PHONE, STORE_TAGLINE } from "@/lib/constants";
import type { Category } from "@/lib/data/types";

/**
 * FOOTER
 *
 * Topografya deseninin kullanıldığı ikinci ve son yer (birincisi hero).
 * Ödeme yöntemi logoları metin tabanlı çizildi — gerçek marka logoları
 * kullanılmadı, çünkü bu bir demo ve marka varlıkları lisanslıdır.
 */
export function Footer({ categories }: { categories: Category[] }) {
  const kurumsal = [
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" },
    { href: "/sss", label: "Sıkça Sorulan Sorular" },
    { href: "/kargo-iade", label: "Kargo & İade" },
  ];

  const sozlesmeler = [
    { href: "/sss#gizlilik", label: "Gizlilik Politikası" },
    { href: "/sss#mesafeli-satis", label: "Mesafeli Satış Sözleşmesi" },
    { href: "/sss#iade-kosullari", label: "İade Koşulları" },
    { href: "/sss#kvkk", label: "KVKK Aydınlatma Metni" },
  ];

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-line bg-surface-alt">
      {/* İmza görsel öğe: soluk topografya deseni */}
      <div
        aria-hidden="true"
        className="topo-pattern pointer-events-none absolute inset-0 opacity-[0.055]"
      />

      <div className="container-page relative py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-ink">
              <LogoMark className="text-[1.6rem]" />
              <span className="font-display text-xl font-bold">{STORE_NAME}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-sage">
              {STORE_TAGLINE}. 2018&apos;den beri kamp ve doğa sporları ekipmanı;
              her ürün satıştan önce ekibimiz tarafından sahada denenir.
            </p>

            <ul className="mt-5 space-y-2 text-sm text-sage">
              <li className="flex items-center gap-2">
                <PhoneIcon className="text-base text-stone" />
                <a href={`tel:${STORE_PHONE.replace(/\s/g, "")}`} className="hover:text-ink">
                  {STORE_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MailIcon className="text-base text-stone" />
                <a href={`mailto:${STORE_EMAIL}`} className="hover:text-ink">
                  {STORE_EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <PinIcon className="text-base text-stone" />
                Kadıköy, İstanbul
              </li>
            </ul>
          </div>

          <FooterColumn title="Kategoriler">
            {categories.map((category) => (
              <FooterLink key={category.id} href={`/kategori/${category.slug}`}>
                {category.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Kurumsal">
            {kurumsal.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Sözleşmeler">
            {sozlesmeler.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-sage">
            © {new Date().getFullYear()} {STORE_NAME}. Bu site bir demo çalışmasıdır,
            gerçek satış yapılmaz.
          </p>

          <div className="flex items-center gap-2" aria-label="Kabul edilen ödeme yöntemleri">
            {["VISA", "MASTERCARD", "TROY", "HAVALE"].map((method) => (
              <span
                key={method}
                className="rounded border border-line bg-surface px-2.5 py-1.5 text-[0.6rem] font-bold tracking-wider text-sage"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-sm font-bold uppercase tracking-wide text-ink">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-sage underline-offset-4 transition-colors hover:text-ink hover:underline"
      >
        {children}
      </Link>
    </li>
  );
}
