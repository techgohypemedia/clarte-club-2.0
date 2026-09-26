import { getShopifyProductByHandle, getShopifyProducts } from "@/lib/shopify-adapter"

export const dynamic = "force-dynamic"

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const handle = url.searchParams.get("handle")?.trim() || ""
  const title = url.searchParams.get("title")?.trim() || ""

  try {
    if (handle) {
      const detail = await getShopifyProductByHandle(handle)
      if (detail?.merchandiseId) {
        return Response.json({
          id: detail.id || detail.slug,
          variantId: detail.merchandiseId,
          title: detail.title,
          variantTitle: detail.sizes?.[0] || "Default Title",
          price: detail.price,
          image: detail.gallery?.[0]?.src || "",
          url: `/products/${detail.slug}`,
        })
      }
    }

    if (title) {
      const wanted = normalize(title)
      const products = await getShopifyProducts(50)
      const product = products.find((item) => {
        const productTitle = normalize(item.name || "")
        const productHandle = normalize(item.handle || "")
        return productTitle === wanted || productHandle === wanted || (productTitle.length > 0 && wanted.includes(productTitle))
      })

      if (product?.merchandiseId) {
        return Response.json({
          id: product.id,
          variantId: product.merchandiseId,
          title: product.name || title,
          variantTitle: product.sizes?.[0] || "Default Title",
          price: product.price || "0",
          image: product.image,
          url: product.href || (product.handle ? `/products/${product.handle}` : "/products"),
        })
      }
    }

    return Response.json({ error: "Product could not be resolved." }, { status: 404 })
  } catch (error) {
    console.error("1Checkout product resolution failed:", error)
    return Response.json({ error: "Product lookup failed." }, { status: 500 })
  }
}
