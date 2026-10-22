import Link from "next/link";

/** Kurumsal sayfaların ortak başlık bloğu: breadcrumb + başlık + spot metin. */
export function PageHeader({
  title,
  lead,
}: {
  title: string;
  lead?: string;
}) {
  return (
    <header className="border-b border-line bg-surface-alt">
      <div className="container-page py-10 sm:py-14">
        <nav aria-label="Konum" className="mb-4 text-xs text-sage">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-ink hover:underline">
                Ana Sayfa
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink" aria-current="page">
              {title}
            </li>
          </ol>
        </nav>

        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          {title}
        </h1>

        {lead && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sage sm:text-base">
            {lead}
          </p>
        )}
      </div>
    </header>
  );
}
