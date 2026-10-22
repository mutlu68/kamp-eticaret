import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Ödeme",
  description: "Siparişinizi tamamlayın.",
  // Ödeme sayfası arama sonuçlarında yer almamalı
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
