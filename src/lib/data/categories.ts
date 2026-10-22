import type { Category } from "./types";

/**
 * Kategoriler. `featured: true` olanlar ana sayfadaki 6'lı kategori
 * vitrininde gösterilir; "Aksesuar" vitrine girmez ama mega menüde ve
 * kendi kategori sayfasında yer alır.
 */
export const categories: Category[] = [
  {
    id: "cat-cadir",
    slug: "cadir",
    name: "Çadır",
    description:
      "Bir gecelik kaçamaktan haftalık yayla kampına kadar; rüzgârı kesen, su geçirmeyen ve tek başına kurulabilen çadırlar.",
    image: "/img/categories/cadir.svg",
    featured: true,
  },
  {
    id: "cat-uyku-tulumu",
    slug: "uyku-tulumu",
    name: "Uyku Tulumu",
    description:
      "Konfor sıcaklığı etiketlenmiş, sıkıştırma torbasıyla gelen uyku tulumları. Yaz gecelerinden eksi dereceye kadar.",
    image: "/img/categories/uyku-tulumu.svg",
    featured: true,
  },
  {
    id: "cat-kamp-ocagi",
    slug: "kamp-ocagi",
    name: "Kamp Ocağı & Pişirme",
    description:
      "Rüzgârda sönmeyen ocaklar, iç içe geçen tencere setleri ve sabah kahvesini kurtaran ekipmanlar.",
    image: "/img/categories/kamp-ocagi.svg",
    featured: true,
  },
  {
    id: "cat-sirt-cantasi",
    slug: "sirt-cantasi",
    name: "Sırt Çantası",
    description:
      "Yükü kalçaya aktaran taşıma sistemleri, günlük 20 litreden çok günlü 75 litreye kadar hacim seçenekleri.",
    image: "/img/categories/sirt-cantasi.svg",
    featured: true,
  },
  {
    id: "cat-aydinlatma",
    slug: "aydinlatma",
    name: "Aydınlatma",
    description:
      "Kafa lambaları, kamp fenerleri ve güneş enerjisiyle şarj olan çözümler — karanlıkta kamp alanı kurmak zorunda kalanlar için.",
    image: "/img/categories/aydinlatma.svg",
    featured: true,
  },
  {
    id: "cat-kamp-mobilyasi",
    slug: "kamp-mobilyasi",
    name: "Kamp Mobilyası",
    description:
      "Katlanınca çantaya sığan sandalyeler, masalar ve karyolalar. Kamp alanını oturulabilir bir yere çeviren parçalar.",
    image: "/img/categories/kamp-mobilyasi.svg",
    featured: true,
  },
  {
    id: "cat-aksesuar",
    slug: "aksesuar",
    name: "Aksesuar",
    description:
      "Termos, matara, çakı, ısı yalıtımlı mat ve kampı kolaylaştıran küçük ama kritik parçalar.",
    image: "/img/categories/aksesuar.svg",
    featured: false,
  },
];

/** Kategori sayfası ve mega menü için hızlı erişim haritası */
export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
export const categoryById = new Map(categories.map((c) => [c.id, c]));
