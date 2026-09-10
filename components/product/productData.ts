export type ProductImage = {
  src: string
  alt: string
  objectPosition?: string
}

export type ProductSwatch = {
  name: string
  value: string
}

export type DeliveryPerk = {
  label: string
  detail: string
  icon: "truck" | "exchange" | "shield" | "card"
}

export type ProductCard = {
  id: string
  merchandiseId?: string
  handle?: string
  href?: string
  image: string
  alt: string
  badge?: string
  featured?: boolean
  sizes?: string[]
  swatches: string[]
  gallery?: string[]
  name?: string
  price?: string
  category?: "Heritage" | "Noir" | "Crystal" | "Atelier" | "Edits" | string
  type?: "Sunglasses" | "Eyeglasses" | "Optical" | string
  gender?: "Men" | "Women" | "Unisex" | string
  shape?: string
  material?: string
  colorGroup?: string
}

export type ProductDetail = {
  id?: string
  merchandiseId?: string
  slug: string
  editLabel: string
  title: string
  breadcrumb: Array<{
    label: string
    href?: string
  }>
  originalPrice: string
  price: string
  sold: string
  rating: string
  description: string
  detailsBody: string
  careNotes: string[]
  shippingNotes: string[]
  colorName: string
  colors: ProductSwatch[]
  sizes: string[]
  gallery: ProductImage[]
  deliveryPerks: DeliveryPerk[]
  completeLook: ProductImage[]
}

export const trendingProducts: ProductCard[] = []

export const featuredProduct: ProductDetail = {
  id: "gid://shopify/Product/7683302916155",
  merchandiseId: "gid://shopify/ProductVariant/43698982060091",
  slug: "heritage-oval",
  editLabel: "HERITAGE COLLECTIVE",
  title: "HERITAGE OVAL",
  breadcrumb: [
    { label: "Homepage", href: "/" },
    { label: "Collections", href: "/collections" },
    { label: "Heritage Oval" },
    { label: "Glossy Black" },
  ],
  originalPrice: "₹10,500",
  price: "₹8,999",
  sold: "1,238 Sold",
  rating: "4.8",
  description:
    "An architectural oval frame sculpted from premium polished bio-acetate, featuring custom hardware and signature wire cores. Engineered to balance sharp contours with smooth, beveled edges for an elevated, timeless profile.",
  detailsBody:
    "Precision-sculpted bio-acetate with 100% UV400 protective lenses. Designed with a robust 5-barrel hinge construction and signature metal temple accents to ensure lasting durability and comfort.",
  careNotes: [
    "Wipe lenses with the microfiber cleaning cloth.",
    "Store in the provided leather protective case.",
    "Avoid leaving in high heat (like a car dashboard).",
    "Rinse with lukewarm water and mild soap if needed.",
  ],
  shippingNotes: [
    "Standard delivery in 2-4 business days.",
    "Free exchange within 14 days.",
    "Cash on delivery available on select pin codes.",
  ],
  colorName: "Glossy Black",
  colors: [
    { name: "Glossy Black", value: "#000000" },
    { name: "Royal Tortoise", value: "#6f5639" },
    { name: "Ivory Mist", value: "#ebe8e1" },
    { name: "Midnight Blue", value: "#111722" },
  ],
  sizes: [],
  gallery: [],
  deliveryPerks: [
    {
      label: "Fast delivery",
      detail: "2-4 days",
      icon: "truck",
    },
    {
      label: "Easy exchange",
      detail: "14 days",
      icon: "exchange",
    },
    {
      label: "Secure checkout",
      detail: "COD available",
      icon: "shield",
    },
    {
      label: "Tracked shipping",
      detail: "Live updates",
      icon: "card",
    },
  ],
  completeLook: [],
}

