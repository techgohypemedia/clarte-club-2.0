import type { MetadataRoute } from "next"

import { fetchAllProducts } from "@/lib/shopify"

// Only real pages: static pages, the collection pages, and one URL per live Shopify product.
// Refreshed hourly so new or removed products are picked up without a deploy.
export const revalidate = 3600

const SITE = "https://www.clarteclub.in"
const STATIC_PAGES = ["/about", "/how-we-do-things", "/contact", "/faq", "/shipping", "/returns", "/privacy", "/terms"]
const COLLECTIONS = ["edits", "heritage", "noir", "crystal", "atelier"]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  let productHandles: string[] = []
  try {
    const products = await fetchAllProducts(250)
    productHandles = (products ?? []).map((p) => p?.handle).filter((h): h is string => Boolean(h))
  } catch (error) {
    console.warn("sitemap: could not load products from Shopify:", error)
  }

  return [
    { url: SITE, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE}/collections`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...COLLECTIONS.map((handle) => ({
      url: `${SITE}/collections/${handle}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...productHandles.map((handle) => ({
      url: `${SITE}/products/${handle}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...STATIC_PAGES.map((path) => ({
      url: `${SITE}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ]
}
