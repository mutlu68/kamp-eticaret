import { NextResponse } from "next/server";

import { buildCartItem, defaultVariant } from "@/lib/cart-helpers";
import { getCartSuggestions } from "@/lib/repository";

/**
 * Sepet drawer'ındaki "Bunları unutma" çapraz satış önerileri.
 *
 * Sepette olmayan, stokta ve fiyatı düşük ürünlerden iki tane döner — küçük
 * tutarlı eklemeler hem sepet ortalamasını yükseltir hem de kargo bedava
 * eşiğine yaklaştırır.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const exclude = (params.get("haric") ?? "").split(",").filter(Boolean);

  const products = await getCartSuggestions(exclude, 2);

  return NextResponse.json({
    suggestions: products.map((product) => ({
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      salePrice: product.salePrice,
      soldOut: product.stock <= 0,
      // Doğrudan sepete eklenebilmesi için hazır satır
      cartItem: buildCartItem(product, defaultVariant(product)),
    })),
  });
}

export type CartSuggestion = {
  slug: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number;
  soldOut: boolean;
  cartItem: import("@/store/cart").AddToCartInput;
};
