import { effectivePrice } from "./format";
import type { Product, Variant } from "./data/types";
import type { AddToCartInput } from "@/store/cart";

/**
 * Ürün + varyanttan sepet satırı üretir.
 *
 * Tek yerde yapılıyor ki fiyat mantığı (indirim + varyant farkı) ürün
 * sayfasında, kartta ve çapraz satış bloklarında birbirinden ayrışmasın.
 */
export function buildCartItem(
  product: Product,
  variant?: Variant,
): AddToCartInput {
  const delta = variant?.priceDelta ?? 0;
  const listPrice = product.price + delta;
  const unitPrice = effectivePrice(product.price, product.salePrice) + delta;

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0],
    unitPrice,
    // Üstü çizili fiyat sadece gerçekten indirim varsa gösterilsin
    listPrice: unitPrice < listPrice ? listPrice : undefined,
    variantId: variant?.id,
    variantLabel: variant?.label,
    maxQuantity: variant ? variant.stock : product.stock,
  };
}

/** Karttan hızlı ekleme için: stokta olan ilk varyant. */
export function defaultVariant(product: Product): Variant | undefined {
  return product.variants.find((v) => v.stock > 0) ?? product.variants[0];
}

/** Üründe gerçek bir seçim var mı — "Tek beden" tek varyant sayılmaz. */
export function hasRealChoice(product: Product): boolean {
  return product.variants.length > 1;
}
