import type { PaymentInput, PaymentProvider, PaymentResult } from "./provider";

/**
 * SAHTE ÖDEME SAĞLAYICI (demo)
 *
 * Gerçek bir para hareketi yapmaz. Ağ gecikmesini taklit eder ve başarı döner.
 *
 * Hata yolunun da test edilebilmesi için bir kaçış kapısı var: kart numarası
 * `4000 0000 0000 0002` girilirse ödeme reddedilir. (Stripe'ın test kartı
 * numarasıyla aynı — alışkanlığı bozmamak için.)
 */
export const mockPaymentProvider: PaymentProvider = {
  name: "Demo Ödeme",
  isSimulated: true,

  async createPayment(input: PaymentInput): Promise<PaymentResult> {
    // Sağlayıcıya gidiş dönüş hissi — butonun "işleniyor" durumu görünsün
    await new Promise((resolve) => setTimeout(resolve, 900));

    const digits = (input.card?.number ?? "").replace(/\D/g, "");

    if (digits === "4000000000000002") {
      return {
        status: "error",
        code: "card_declined",
        message:
          "Kartınız reddedildi. Farklı bir kart deneyin veya bankanızla görüşün.",
      };
    }

    if (input.total <= 0) {
      return {
        status: "error",
        code: "empty_cart",
        message: "Sepetiniz boş görünüyor.",
      };
    }

    return {
      status: "success",
      transactionId: `DEMO-${Date.now().toString(36).toUpperCase()}`,
    };
  },
};

/**
 * Aktif sağlayıcıyı döner.
 *
 * Gerçek entegrasyonda:
 *   return process.env.PAYMENT_PROVIDER === "iyzico"
 *     ? iyzicoProvider
 *     : mockPaymentProvider;
 */
export function getPaymentProvider(): PaymentProvider {
  return mockPaymentProvider;
}
