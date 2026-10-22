import type { CartItem, OrderCustomer } from "@/lib/data/types";

/**
 * ÖDEME SAĞLAYICI ARAYÜZÜ
 * =======================
 * Checkout sayfası somut bir sağlayıcıyı DEĞİL, bu arayüzü çağırır.
 *
 * Gerçek entegrasyona geçiş (iyzico / Stripe / PayTR):
 *   1. `lib/payment/iyzico.ts` dosyasında `PaymentProvider` arayüzünü uygulayın
 *   2. `getPaymentProvider()` içindeki seçimi ortam değişkenine bağlayın
 *   3. Sayfa kodunda tek satır bile değişmez
 *
 * GÜVENLİK NOTU: gerçek entegrasyonda kart bilgisi asla kendi sunucunuza
 * gönderilmemeli. iyzico/Stripe'ın barındırdığı forma (checkout.js / Elements)
 * yönlendirin, siz yalnızca token alın. Aşağıdaki `CardInput` yalnızca demo
 * formunun tipini tanımlıyor ve hiçbir yere iletilmiyor.
 */

export interface CardInput {
  /** Kart numarası — DEMO. Gerçek entegrasyonda burası sağlayıcının iframe'i olur. */
  number: string;
  holder: string;
  expiry: string;
  cvc: string;
}

export interface PaymentInput {
  items: CartItem[];
  customer: OrderCustomer;
  subtotal: number;
  shipping: number;
  total: number;
  card?: CardInput;
}

export type PaymentResult =
  | {
      status: "success";
      /** Sağlayıcının işlem kimliği. */
      transactionId: string;
    }
  | {
      status: "error";
      /** Kullanıcıya gösterilebilir hata mesajı (Türkçe). */
      message: string;
      code?: string;
    };

export interface PaymentProvider {
  /** Sağlayıcının insan tarafından okunabilir adı — arayüzde gösterilir. */
  readonly name: string;
  /** Bu sağlayıcı gerçek para hareketi yapıyor mu? Demo uyarısı buna bakar. */
  readonly isSimulated: boolean;

  createPayment(input: PaymentInput): Promise<PaymentResult>;
}
