import type { MetadataRoute } from "next";

/** Ödeme ve API yolları taranmasın; site haritası bildirilsin. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/odeme", "/odeme/", "/api/"],
    },
    sitemap: "https://kamprotasi.example/sitemap.xml",
  };
}
