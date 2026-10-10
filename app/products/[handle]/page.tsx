import type { Metadata } from "next"
import { ProductPage } from "@/components/product/ProductPage"
import { notFound } from "next/navigation"
import { getShopifyProductByHandle } from "@/lib/shopify-adapter"

// Cached product pages (ISR): rendered on first visit, then served instantly from cache and refreshed in the
// background at most every 60s, so price/stock changes in Shopify show up within a minute.
// Previously force-dynamic: every click waited for a fresh server render + Shopify round trip.
export const revalidate = 60

// No pages at build time; each product page is generated the first time it is visited
export function generateStaticParams() {
  return []
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getShopifyProductByHandle(handle)
  const title = product?.title || handle.replace(/-/g, " ").toUpperCase()

  return {
    title: `${title} | Clarte Club`,
    description: product?.description || "Browse signature products at Clarte Club.",
    // One canonical URL per product: /product/x and /products/x serve the same page
    alternates: { canonical: `https://www.clarteclub.in/products/${handle}` },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const liveProduct = await getShopifyProductByHandle(handle)
  // Unknown handle (deleted or mistyped link): show the 404 page, not a different product
  if (!liveProduct) notFound()

  return <ProductPage product={liveProduct} />
}
