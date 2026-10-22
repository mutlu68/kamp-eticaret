import { ShopChrome } from "@/components/layout/ShopChrome";

/** Mağaza tarafındaki tüm sayfaların ortak kabuğu. */
export default function ShopLayout({ children }: LayoutProps<"/">) {
  return <ShopChrome>{children}</ShopChrome>;
}
