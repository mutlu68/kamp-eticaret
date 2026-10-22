import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CollectionView } from "@/components/collection/CollectionView";
import { getCategories, getCategoryBySlug } from "@/lib/repository";

/** Kategori sayfaları da statik üretilebilsin diye slug listesi. */
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(
  props: PageProps<"/kategori/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);

  if (!category) return { title: "Kategori bulunamadı" };

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/kategori/${category.slug}` },
    openGraph: {
      title: category.name,
      description: category.description,
      images: [{ url: category.image, alt: category.name }],
    },
  };
}

export default async function CategoryPage(props: PageProps<"/kategori/[slug]">) {
  const [{ slug }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  return (
    <CollectionView
      title={category.name}
      description={category.description}
      categoryId={category.id}
      searchParams={searchParams}
    />
  );
}
