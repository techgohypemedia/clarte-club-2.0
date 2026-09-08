import type { Metadata } from "next"
import { ProductPage } from "@/components/product/ProductPage"
import { featuredProduct } from "@/components/product/productData"
import { getShopifyProductByHandle } from "@/lib/shopify-adapter"

export const dynamic = "force-dynamic"

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
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const liveProduct = await getShopifyProductByHandle(handle)

  return <ProductPage product={liveProduct || featuredProduct} />
}
