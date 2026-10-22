/** Koşullu sınıf birleştirme. Tailwind sınıf çakışmalarını çözmez, sadece
 *  falsy değerleri eler — bu projede yeterli, ekstra bağımlılık gerekmiyor. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
