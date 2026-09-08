import {
  fetchAllProducts,
  fetchCollectionByHandle,
  fetchProductByHandle,
  formatMoney,
  toProductCard,
  extractOptionValues,
} from "./shopify"
import type { ProductCard, ProductDetail, ProductImage } from "@/components/product/productData"

function getProductFallbackImages(_indexOrId: number | string): string[] {
  return []
}

function extractTagsMetadata(tags: string[] = []) {
  let shape = ""
  let material = ""
  let colorGroup = ""
  let type: "Sunglasses" | "Optical" | undefined = undefined
  let badge: string | undefined = undefined

  const shapeKeywords = ["square", "cat-eye", "cateye", "round", "aviator", "geometric", "oval", "d-frame", "panto", "hexagon"]
  const materialKeywords = ["acetate", "metal", "titanium", "gold", "crystal", "bio-acetate"]

  for (const tag of tags) {
    const t = tag.toLowerCase()
    if (t.includes("sunglass")) type = "Sunglasses"
    if (t.includes("optical")) type = "Optical"
    if (t.includes("new") || t.includes("bestseller") || t.includes("exclusive")) {
      badge = tag.toUpperCase()
    }
    for (const s of shapeKeywords) {
      if (t.includes(s)) shape = s
    }
    for (const m of materialKeywords) {
      if (t.includes(m)) material = m
    }
    if (t.includes("noir") || t.includes("black")) colorGroup = "monochrome"
    else if (t.includes("gold") || t.includes("champagne")) colorGroup = "gold"
    else if (t.includes("crystal") || t.includes("smoke")) colorGroup = "crystal"
    else if (t.includes("tortoise") || t.includes("havana")) colorGroup = "tortoiseshell"
  }

  return { shape, material, colorGroup, type, badge }
}

export function shopifyProductToCard(node: any, index = 0): ProductCard {
  if (!node) {
    return {
      id: "fallback-1",
      name: "Signature Eyewear",
      price: "₹ 4,500",
      image: "",
      alt: "Signature Eyewear",
      swatches: ["#000000", "#6f5639"],
      gallery: [],
    }
  }

  const tags = Array.isArray(node.tags) ? node.tags : []
  const { shape, material, colorGroup, type: tagType, badge: tagBadge } = extractTagsMetadata(tags)

  // Direct Shopify Images
  const shopifyImages: string[] = []
  if (Array.isArray(node.images?.nodes)) {
    for (const img of node.images.nodes) {
      if (img?.url) shopifyImages.push(img.url)
    }
  } else if (Array.isArray(node.images)) {
    for (const img of node.images) {
      if (typeof img === "string") shopifyImages.push(img)
      else if (img?.url) shopifyImages.push(img.url)
    }
  }

  if (shopifyImages.length === 0 && node.featuredImage?.url) {
    shopifyImages.push(node.featuredImage.url)
  }

  const finalGallery = shopifyImages
  const primaryImage = shopifyImages.length > 0 ? shopifyImages[0] : ""

  const handle = node.handle || ""
  const href = handle ? `/products/${handle}` : "/products"
  const variantId = node?.variants?.nodes?.[0]?.id || node?.variants?.[0]?.id || ""

  // Price formatting
  const priceVal = node.priceRange?.minVariantPrice?.amount || node.price || (node.variants?.nodes?.[0]?.price?.amount) || "4500"
  const currency = node.priceRange?.minVariantPrice?.currencyCode || node.currencyCode || "INR"
  const formattedPrice = formatMoney(priceVal, currency)

  const productType = (node.productType || tagType || (tags.some((t: string) => t.toLowerCase().includes("sunglass")) ? "Sunglasses" : "Optical")) as "Sunglasses" | "Optical"
  const category = (node.vendor || node.productType || "Signature").replace(/Frames|Collective/i, "").trim()

  return {
    id: node.id || handle || `product-${index}`,
    merchandiseId: variantId,
    handle,
    href,
    name: node.title || "Signature Frame",
    price: formattedPrice,
    image: primaryImage,
    alt: node.featuredImage?.altText || node.title || "Product image",
    badge: tagBadge || (index === 0 ? "NEW DROP" : undefined),
    category,
    type: productType,
    shape: shape || "Classic",
    material: material || "Acetate",
    colorGroup: colorGroup || "Monochrome",
    swatches: extractOptionValues(node, "color").length
      ? extractOptionValues(node, "color")
      : ["#000000", "#6f5639", "#ebe8e1"],
    gallery: finalGallery,
  }
}

function extractCleanShortDescription(html: string = "", fallbackPlain: string = ""): string {
  if (!html && !fallbackPlain) return ""

  // If HTML is present, extract paragraph text before <ul> or <ol>
  if (html && (html.includes("<p") || html.includes("<em") || html.includes("<span"))) {
    const withoutLists = html.split(/<ul|<ol|<table/i)[0] || html
    let clean = withoutLists
      .replace(/<\/p>/gi, " ")
      .replace(/<br\s*[\/]?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/([.!?])([A-Za-z])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim()

    if (clean.length > 20) return clean
  }

  // Fallback cleanup on plain string
  return fallbackPlain
    .replace(/([.!?])([A-Za-z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
}

function getMetafieldValue(node: any, ...keysToMatch: string[]): string | null {
  const metafields = Array.isArray(node?.metafields) ? node.metafields : []
  const lowerKeys = keysToMatch.map((k) => k.toLowerCase())
  
  for (const mf of metafields) {
    if (!mf || !mf.value) continue
    const k = (mf.key || "").toLowerCase()
    const ns = (mf.namespace || "").toLowerCase()
    const fullKey = `${ns}.${k}`
    
    if (
      lowerKeys.includes(k) ||
      lowerKeys.includes(fullKey) ||
      lowerKeys.some((target) => k.replace(/[-_]/g, "") === target.replace(/[-_]/g, ""))
    ) {
      return mf.value
    }
  }

  if (node?.metafield?.value) {
    return node.metafield.value
  }

  return null
}

function parseMetafieldNotes(value: any, fallback: string[]): string[] {
  if (!value) return fallback
  
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) return fallback

    // JSON array format (e.g. from Shopify list metafield)
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => String(item).trim()).filter(Boolean)
        }
      } catch {
        // Not JSON
      }
    }

    // Rich text JSON format from Shopify rich_text_field
    if (trimmed.startsWith("{") && trimmed.includes('"type":')) {
      try {
        const parsed = JSON.parse(trimmed)
        const extracted: string[] = []
        const extractText = (obj: any) => {
          if (!obj) return
          if (obj.type === "text" && obj.value) extracted.push(obj.value)
          if (Array.isArray(obj.children)) obj.children.forEach(extractText)
        }
        extractText(parsed)
        if (extracted.length > 0) return extracted
      } catch {
        // ignore
      }
    }
    
    // Newline-separated points (e.g. multi-line text field)
    if (trimmed.includes("\n")) {
      const lines = trimmed
        .split(/\r?\n/)
        .map((line) => line.replace(/^[\s•\-\*0-9\.\)]+/, "").trim())
        .filter(Boolean)
      if (lines.length > 0) return lines
    }

    // Period-separated sentences (e.g. "Standard delivery in 2-4 business days. Free exchange within 14 days.")
    const sentences = trimmed
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    if (sentences.length > 0) return sentences
    return [trimmed]
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }

  return fallback
}

export function shopifyProductToDetail(node: any): ProductDetail {
  // Direct Shopify Images
  const shopifyImages: ProductImage[] = []
  if (Array.isArray(node.images?.nodes)) {
    for (const img of node.images.nodes) {
      if (img?.url) {
        shopifyImages.push({
          src: img.url,
          alt: img.altText || node.title || "Product Image",
        })
      }
    }
  } else if (Array.isArray(node.images)) {
    for (const img of node.images) {
      if (typeof img === "string") {
        shopifyImages.push({ src: img, alt: node.title || "Product Image" })
      } else if (img?.url) {
        shopifyImages.push({ src: img.url, alt: img.alt || node.title || "Product Image" })
      }
    }
  }

  if (shopifyImages.length === 0 && node.featuredImage?.url) {
    shopifyImages.push({
      src: node.featuredImage.url,
      alt: node.featuredImage.altText || node.title || "Product Image",
    })
  }

  const gallery: ProductImage[] = shopifyImages

  const colorValues = extractOptionValues(node, "color")
  const colors = colorValues.length
    ? colorValues.map((name: string) => ({ name, value: "#000000" }))
    : [
        { name: "Glossy Black", value: "#000000" },
        { name: "Royal Tortoise", value: "#6f5639" },
        { name: "Ivory Mist", value: "#ebe8e1" },
      ]

  const sizeValues = extractOptionValues(node, "size")
  const firstVariantId = node?.variants?.nodes?.[0]?.id || node?.variants?.[0]?.id || ""

  const rawPrice = node.priceRange?.minVariantPrice?.amount || node.price || (node.variants?.nodes?.[0]?.price?.amount) || "4500"
  const rawComparePrice = node.variants?.nodes?.[0]?.compareAtPrice?.amount || node.compareAtPrice
  const currency = node.priceRange?.minVariantPrice?.currencyCode || node.currencyCode || "INR"

  const price = formatMoney(rawPrice, currency)
  const originalPrice = rawComparePrice ? formatMoney(rawComparePrice, currency) : ""

  const cleanDescription = extractCleanShortDescription(node.descriptionHtml, node.description) ||
    "An architectural frame sculpted from premium bio-acetate with custom hardware and signature wire cores."

  // Dynamic Shopify Metafields extraction for Care & Shipping
  const rawCareValue = getMetafieldValue(
    node,
    "details_and_care",
    "details_care",
    "details-and-care",
    "details-care",
    "care_and_details",
    "care_details",
    "care_instructions",
    "care",
    "wash_care",
    "details"
  )

  const rawShippingValue = getMetafieldValue(
    node,
    "shipping_and_payment",
    "shipping_payment",
    "shipping-and-payment",
    "shipping-payment",
    "shipping_and_delivery",
    "shipping_delivery",
    "shipping_policy",
    "shipping",
    "payment",
    "delivery"
  )

  const defaultCareNotes = [
    "Wipe lenses with the microfiber cleaning cloth.",
    "Store in the provided leather protective case.",
    "Avoid leaving in direct high heat.",
    "Rinse with lukewarm water and mild soap if needed.",
  ]

  const defaultShippingNotes = [
    "Standard delivery in 2-4 business days.",
    "Free exchange within 14 days.",
    "Cash on delivery available across India.",
  ]

  const careNotes = parseMetafieldNotes(rawCareValue, defaultCareNotes)
  const shippingNotes = parseMetafieldNotes(rawShippingValue, defaultShippingNotes)

  return {
    id: node?.id || "product-detail",
    merchandiseId: firstVariantId,
    slug: node?.handle || "product",
    editLabel: (node?.vendor || node?.productType || "CLARTÉ CLUB").toUpperCase(),
    title: (node?.title || "SIGNATURE FRAME").toUpperCase(),
    breadcrumb: [
      { label: "Homepage", href: "/" },
      { label: "Collections", href: "/collections" },
      { label: node?.title || "Product" },
    ],
    originalPrice,
    price,
    sold: "1,238 Sold",
    rating: "4.8",
    description: cleanDescription,
    detailsBody:
      node?.descriptionHtml ||
      node?.description ||
      "Precision-sculpted bio-acetate frame with 100% UV400 protective lenses.",
    careNotes,
    shippingNotes,
    colorName: colorValues[0] || "Glossy Black",
    colors,
    sizes: sizeValues,
    gallery,
    deliveryPerks: [
      { label: "Fast delivery", detail: "2-4 days", icon: "truck" },
      { label: "Easy exchange", detail: "14 days", icon: "exchange" },
      { label: "Secure checkout", detail: "COD available", icon: "shield" },
      { label: "Tracked shipping", detail: "Live updates", icon: "card" },
    ],
    completeLook: gallery.slice(0, 3),
  }
}

export async function getShopifyProducts(limit = 50): Promise<ProductCard[]> {
  try {
    const products = await fetchAllProducts(limit)
    if (products && products.length > 0) {
      console.log(`🛍️ [Shopify API] Successfully loaded ${products.length} live products from shapar-ay.myshopify.com`)
      return products.map((p: any, i: number) => shopifyProductToCard(p, i))
    }
  } catch (error) {
    console.warn("❌ [Shopify API] Failed to fetch products from Shopify API:", error)
  }
  return []
}

export async function getShopifyCollectionProducts(handle: string, limit = 50): Promise<ProductCard[]> {
  try {
    const collection = await fetchCollectionByHandle(handle, limit)
    if (collection?.products?.length) {
      console.log(`🛍️ [Shopify API] Loaded ${collection.products.length} products for collection '${handle}'`)
      return collection.products.map((p: any, i: number) => shopifyProductToCard(p, i))
    }
  } catch (error) {
    console.warn(`❌ [Shopify API] Failed to fetch collection '${handle}' from Shopify API:`, error)
  }
  return []
}

export async function getShopifyProductByHandle(handle: string): Promise<ProductDetail | null> {
  if (!handle) return null
  try {
    // 1. Direct handle lookup
    let product = await fetchProductByHandle(handle)
    if (product) {
      console.log(`🛍️ [Shopify API] Loaded live product '${product.title}' (${handle})`)
      return shopifyProductToDetail(product)
    }

    // 2. Fuzzy match across all catalog products (e.g. the-noir vs the-noir-1)
    const allProducts = await fetchAllProducts(50)
    if (allProducts && allProducts.length > 0) {
      const cleanHandle = handle.toLowerCase().replace(/-\d+$/, "")
      const matched = allProducts.find((p: any) => {
        const pHandle = (p.handle || "").toLowerCase()
        const pTitle = (p.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")
        return (
          pHandle === handle.toLowerCase() ||
          pHandle.replace(/-\d+$/, "") === cleanHandle ||
          pTitle === cleanHandle ||
          pTitle === handle.toLowerCase()
        )
      })

      if (matched) {
        console.log(`🛍️ [Shopify API] Fuzzy-matched live product '${matched.title}' for handle '${handle}'`)
        return shopifyProductToDetail(matched)
      }
    }
  } catch (error) {
    console.warn(`❌ [Shopify API] Failed to fetch product '${handle}' from Shopify API:`, error)
  }
  return null
}
