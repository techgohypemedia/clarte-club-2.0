// Shopify Storefront API client for Next.js

const getEnv = (key: string, defaultValue = ''): string => {
  if (typeof process !== 'undefined' && process.env) {
    return (
      process.env[`NEXT_PUBLIC_${key}`] ||
      process.env[`VITE_${key}`] ||
      process.env[key] ||
      defaultValue
    );
  }
  return defaultValue;
};
const domain =
  process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ||
  process.env.SHOPIFY_DOMAIN ||
  getEnv('SHOPIFY_DOMAIN', 'shapar-ay.myshopify.com');
const token =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ||
  process.env.SHOPIFY_STOREFRONT_TOKEN ||
  getEnv('SHOPIFY_STOREFRONT_TOKEN', '');
const apiVersion =
  process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION ||
  process.env.SHOPIFY_API_VERSION ||
  getEnv('SHOPIFY_API_VERSION', '2026-07');
const hasShopifyConfig = Boolean(domain && token);
const endpoint = hasShopifyConfig
  ? `https://${domain}/api/${apiVersion}/graphql.json`
  : null;
const defaultRequestTimeoutMs = Number(
  getEnv('SHOPIFY_REQUEST_TIMEOUT_MS', '15000')
);

export async function graphql<T = any>(
  query: string,
  variables: Record<string, any> = {},
  { timeoutMs = defaultRequestTimeoutMs }: { timeoutMs?: number } = {}
): Promise<T> {
  if (!hasShopifyConfig || !endpoint) {
    return {} as T;
  }

  const controller =
    typeof AbortController !== 'undefined' ? new AbortController() : null;
  let timeoutId: NodeJS.Timeout | null = null;

  if (controller && Number.isFinite(timeoutMs) && timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);
  }

  let res: Response;
  let text = '';
  let json: any;

  try {
    const isServer = typeof window === 'undefined';
    const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
      signal: controller?.signal,
    };
    if (isServer) {
      fetchOptions.next = { revalidate: 60 };
    }

    res = await fetch(endpoint, fetchOptions);
  } catch (e: any) {
    if (controller?.signal?.aborted) {
      const timeoutError = new Error(
        `Shopify request timed out after ${timeoutMs}ms`
      );
      timeoutError.name = 'AbortError';
      throw timeoutError;
    }
    console.error('Network error calling Shopify:', e);
    throw e;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  try {
    text = await res.text();
    json = JSON.parse(text);
  } catch {
    throw new Error(
      `Non-JSON response (${res.status}): ${String(text).slice(0, 300)}`
    );
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(json)}`);
  }
  if (json.errors?.length) {
    throw new Error(json.errors.map((e: any) => e.message).join('; '));
  }
  return json.data;
}

/* ================= SHARED HELPERS ================= */

const defaultLanguage = getEnv('SHOPIFY_LANGUAGE', 'en-US');

const fallbackCurrency = (countryCode: string) => {
  switch (countryCode) {
    case 'IN':
      return 'INR';
    case 'GB':
      return 'GBP';
    case 'EU':
      return 'EUR';
    default:
      return 'USD';
  }
};

const defaultCurrencyCode =
  getEnv('SHOPIFY_CURRENCY') ||
  fallbackCurrency((getEnv('SHOPIFY_COUNTRY', 'IN')).toUpperCase());

const parseAmount = (amount: any): number => {
  if (amount == null) return 0;
  const numeric = Number.parseFloat(Array.isArray(amount) ? amount[0] : amount);
  return Number.isFinite(numeric) ? numeric : 0;
};

export function formatMoney(
  amount: any,
  currencyCode = defaultCurrencyCode,
  locale = defaultLanguage
): string {
  const value = parseAmount(amount);
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode || defaultCurrencyCode,
      currencyDisplay: 'symbol',
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);
  } catch {
    return `${currencyCode || defaultCurrencyCode} ${value.toFixed(2)}`;
  }
}

const hiddenKeywords = (getEnv('SHOPIFY_HIDE_KEYWORDS', ''))
  .split(',')
  .map((keyword) => keyword.trim().toLowerCase())
  .filter(Boolean);

const shouldHideProductNode = (node: any): boolean => {
  if (!node || hiddenKeywords.length === 0) return false;

  const casefold = (value: any) => String(value ?? '').toLowerCase();

  const handle = casefold(node.handle);
  const title = casefold(node.title);
  const type = casefold(node.productType);

  const tags = Array.isArray(node.tags)
    ? node.tags.map((tag: any) => casefold(tag))
    : [];

  const haystacks = [handle, title, type, ...tags];
  return haystacks.some((value) =>
    hiddenKeywords.some((keyword) => value.includes(keyword))
  );
};

const filterVisibleNodes = (nodes: any[] = []) =>
  hiddenKeywords.length === 0
    ? nodes
    : nodes.filter((node) => !shouldHideProductNode(node));

const shouldHideCollectionNode = (node: any): boolean => {
  if (!node || hiddenKeywords.length === 0) return false;
  const casefold = (value: any) => String(value ?? '').toLowerCase();
  const handle = casefold(node.handle);
  const title = casefold(node.title);
  return hiddenKeywords.some(
    (keyword) => handle.includes(keyword) || title.includes(keyword)
  );
};

const normaliseImage = (image: any, fallbackAlt = '') => {
  if (!image?.url) return null;
  return {
    url: image.url,
    alt: image.altText || image.alt || fallbackAlt || '',
  };
};

const normalizeMediaSource = (source: any) => {
  if (!source?.url) return null;
  return {
    url: source.url,
    mimeType: source.mimeType ?? '',
    format: source.format ?? '',
    width: source.width ?? null,
    height: source.height ?? null,
  };
};

const normalizeMediaNode = (media: any, fallbackAlt = '') => {
  if (!media) return null;

  const alt = media.alt || media?.previewImage?.altText || fallbackAlt || '';
  const previewImage = normaliseImage(media.previewImage, alt);

  const base = {
    id: media.id ?? null,
    __typename: media.__typename ?? null,
    alt,
    mediaContentType: media.mediaContentType ?? null,
    previewImage,
  };

  if (media.__typename === 'MediaImage') {
    return {
      ...base,
      image: normaliseImage(media.image, alt),
    };
  }

  if (media.__typename === 'Video') {
    return {
      ...base,
      sources: media.sources?.map(normalizeMediaSource)?.filter(Boolean) ?? [],
    };
  }

  if (media.__typename === 'ExternalVideo') {
    return {
      ...base,
      embedUrl: media.embedUrl ?? media.embeddedUrl ?? null,
      host: media.host ?? null,
      originUrl: media.originUrl ?? null,
    };
  }

  return base;
};

export const extractOptionValues = (product: any, optionName: string): string[] => {
  if (!product?.options?.length) return [];
  const target = optionName?.toLowerCase();
  const option = product.options.find(
    (opt: any) => opt?.name?.toLowerCase() === target
  );
  return option?.values ?? [];
};

export function normalizeProductNode(node: any) {
  if (!node) return null;
  if (shouldHideProductNode(node)) return null;

  const price = parseAmount(node.priceRange?.minVariantPrice?.amount);
  const currencyCode =
    node.priceRange?.minVariantPrice?.currencyCode || defaultCurrencyCode;

  const images =
    node.images?.nodes
      ?.map((img: any) => normaliseImage(img, node.title))
      ?.filter(Boolean) ?? [];

  const featuredImage =
    normaliseImage(node.featuredImage, node.title) ?? images[0] ?? null;

  const media =
    node.media?.nodes
      ?.map((item: any) => normalizeMediaNode(item, node.title))
      ?.filter(Boolean) ?? [];

  const variants =
    node.variants?.nodes?.map((variant: any) => ({
      id: variant.id,
      title: variant.title,
      availableForSale: Boolean(variant.availableForSale),
      sku: variant.sku ?? null,
      quantityAvailable: variant.quantityAvailable ?? null,
      price: parseAmount(variant.price?.amount ?? price),
      compareAtPrice: parseAmount(variant.compareAtPrice?.amount) || null,
      currencyCode: variant.price?.currencyCode || currencyCode,
      selectedOptions:
        variant.selectedOptions?.map((opt: any) => ({
          name: opt?.name ?? '',
          value: opt?.value ?? '',
        })) ?? [],
    })) ?? [];

  const compareAtPrice =
    variants.find(
      (variant: any) =>
        Number.isFinite(variant.compareAtPrice) &&
        variant.compareAtPrice > variant.price
    )?.compareAtPrice ?? null;

  const collections =
    node.collections?.nodes?.map((collection: any) => ({
      id: collection?.id ?? null,
      handle: collection?.handle ?? '',
      title: collection?.title ?? '',
    })) ?? [];

  const optionLookup: Record<string, string[]> = {};
  (node.options ?? []).forEach((option: any) => {
    if (!option?.name) return;
    optionLookup[option.name.toLowerCase()] = option.values ?? [];
  });

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    vendor: node.vendor ?? '',
    productType: node.productType ?? '',
    description: node.description ?? '',
    descriptionHtml: node.descriptionHtml ?? '',
    tags: node.tags ?? [],
    featuredImage,
    images,
    media,
    price,
    compareAtPrice,
    currencyCode,
    priceRange: node.priceRange ?? null,
    variants,
    options: node.options ?? [],
    optionValues: optionLookup,
    collections,
    reviewsPayload: node.metafield?.value ?? null,
    metafields: node.metafields ?? [],
    seo: node.seo ?? null,
  };
}

export function toProductCard(product: any) {
  if (!product) return null;
  const tags = Array.isArray(product.tags) ? product.tags : [];
  const promoTagPattern = /^(?:voucher|coupon|discount(?:_?code)?|promo(?:_?code)?)\s*[-:=]\s*(.+)$/i;
  const badgeTagPattern = /^(?:badge|label)\s*[-:=]\s*(.+)$/i;
  const offerTagPattern = /^(?:offer|deal|discount|promo|sale)\s*[-:=]\s*(.+)$/i;
  const directOfferPattern = /^(?:\d{1,3}\s*%\s*off|flat\s*\d+(?:\.\d+)?\s*off)$/i;

  const normaliseOfferLabel = (value: any) =>
    String(value ?? '')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();

  const voucherCode =
    tags
      .map((tag: any) => String(tag ?? '').trim())
      .map((tag: string) => tag.match(promoTagPattern)?.[1]?.trim())
      .find(Boolean) ?? null;

  const explicitBadge =
    tags
      .map((tag: any) => String(tag ?? '').trim())
      .map((tag: string) => tag.match(badgeTagPattern)?.[1]?.trim())
      .find(Boolean) ?? null;

  const offerBadge =
    tags
      .map((tag: any) => String(tag ?? '').trim())
      .map((tag: string) => {
        const mapped = tag.match(offerTagPattern)?.[1]?.trim();
        if (mapped) return mapped;
        return directOfferPattern.test(tag) ? tag : null;
      })
      .find(Boolean) ?? null;

  const hasNewTag = tags.some((tag: any) => normaliseTokenValue(tag) === 'new');

  const displayTags: string[] = [];
  const seenTags = new Set<string>();
  for (const rawTag of tags) {
    const tag = String(rawTag ?? '').trim();
    if (!tag) continue;
    if (
      promoTagPattern.test(tag) ||
      badgeTagPattern.test(tag) ||
      offerTagPattern.test(tag) ||
      directOfferPattern.test(tag)
    ) {
      continue;
    }
    if (normaliseTokenValue(tag) === 'new') continue;

    const label = tag
      .replace(/[:_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!label) continue;

    const dedupeToken = normaliseTokenValue(label);
    if (seenTags.has(dedupeToken)) continue;

    seenTags.add(dedupeToken);
    displayTags.push(label);
    if (displayTags.length >= 3) break;
  }

  const image =
    product.featuredImage?.url ?? product.images?.[0]?.url ?? undefined;
  const secondaryImage =
    product.images?.find((img: any) => img?.url && img.url !== image)?.url ?? null;
  const currency = product.currencyCode || defaultCurrencyCode;
  const offerLabel = offerBadge ? normaliseOfferLabel(offerBadge) : null;
  const cardBadge = explicitBadge || (hasNewTag ? 'New' : undefined);

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    price: formatMoney(product.price, currency),
    img: image,
    hoverImg: secondaryImage,
    badge: cardBadge,
    offerLabel,
    tags: displayTags,
    voucherCode,
    href: `/product/${product.handle}`,
    variants: product.variants || [],
  };
}

const mapCollectionNode = (node: any) => {
  if (!node) return null;
  if (shouldHideCollectionNode(node)) return null;
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    image: normaliseImage(node.image, node.title),
    description: node.description ?? '',
  };
};

export const normaliseTokenValue = (value: any): string =>
  value?.toString().trim().toLowerCase() ?? '';

export function findVariantForSize(product: any, size: string | null | undefined) {
  const variants = product?.variants ?? [];
  if (!variants.length) return null;

  const isSizeOptionName = (name: any) => {
    const token = normaliseTokenValue(name);
    return token === 'size' || token.includes('size');
  };

  if (!size) {
    return variants[0] ?? null;
  }

  const target = normaliseTokenValue(size);

  const matchByOption = variants.find((variant: any) =>
    variant.selectedOptions?.some(
      (option: any) =>
        isSizeOptionName(option?.name) &&
        normaliseTokenValue(option?.value) === target
    )
  );

  if (matchByOption) return matchByOption;

  return (
    variants.find((variant: any) => {
      const title = normaliseTokenValue(variant?.title);
      if (title && title === target) return true;
      const tokens =
        variant?.title
          ?.toLowerCase()
          ?.split('/')
          ?.map((token: string) => token.trim()) ?? [];
      return tokens.includes(target);
    }) ?? variants[0]
  );
}

export const getProductImageUrl = (product: any): string =>
  product?.featuredImage?.url ?? product?.images?.[0]?.url ?? '';

export function getProductVideoMedia(product: any) {
  const media = Array.isArray(product?.media) ? product.media : [];
  return (
    media.find((item: any) => item?.__typename === 'Video') ??
    media.find((item: any) => item?.__typename === 'ExternalVideo') ??
    null
  );
}

/* ================= NAVIGATION ================= */

const defaultMenuItems = [
  { id: 'all-products', label: 'Clothing', to: '/clothing', kind: 'all' },
  {
    id: 'collection-t-shirts',
    label: 'T-Shirts',
    to: '/collections/t-shirts',
    handle: 't-shirts',
    kind: 'collection',
  },
  {
    id: 'collection-polos',
    label: 'Polos',
    to: '/collections/polos',
    handle: 'polos',
    kind: 'collection',
  },
  {
    id: 'collection-jeans',
    label: 'Jeans',
    to: '/collections/jeans',
    handle: 'jeans',
    kind: 'collection',
  },
];

const escapedShopDomain = domain
  ? domain.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
  : null;
const shopDomainRegex = escapedShopDomain
  ? new RegExp(`^https?://(?:www\\.)?${escapedShopDomain}`, 'i')
  : /^https?:\/\/[^/]+/i;

function mapMenuUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const raw = String(url).trim();
  if (!raw) return null;

  let pathname = raw;
  let search = '';
  let hostMatchesDomain = false;

  try {
    const parsed = new URL(
      raw,
      domain ? `https://${domain}` : 'https://example.com'
    );
    pathname = parsed.pathname || '/';
    search = parsed.search || '';
    if (/^https?:\/\//i.test(raw)) {
      hostMatchesDomain =
        !domain || parsed.host === domain || parsed.host === `www.${domain}`;
    } else if (shopDomainRegex.test(raw)) {
      hostMatchesDomain = true;
    } else {
      hostMatchesDomain = true;
    }
  } catch {
    if (!raw.startsWith('/')) {
      return raw;
    }
    pathname = raw;
    search = '';
    hostMatchesDomain = true;
  }

  const normalized = `${pathname}${search}`;

  if (hostMatchesDomain) {
    if (pathname === '/products' || pathname === '/apparel') {
      return '/clothing';
    }

    if (pathname.startsWith('/collections/')) {
      const parts = pathname.split('/');
      const handle = parts[2]?.split('?')[0];
      if (handle && handle !== 'all') {
        return `/collections/${handle}`;
      }
      return '/products';
    }

    if (pathname.startsWith('/products/')) {
      const parts = pathname.split('/');
      const handle = parts[2]?.split('?')[0];
      if (handle) {
        return `/product/${handle}`;
      }
    }
  }

  return normalized;
}

function mapMenuItems(items: any[] = []) {
  return items
    .map((item, index) => {
      const id = item?.id || `menu-${index}`;
      const label = String(item?.title || '').trim() || 'Menu Item';
      const resource = item?.resource;

      if (resource?.__typename === 'Collection' && resource.handle) {
        return {
          id,
          label,
          to: `/collections/${resource.handle}`,
          handle: resource.handle,
          kind: 'collection',
        };
      }

      if (resource?.__typename === 'Product' && resource.handle) {
        return {
          id,
          label,
          to: `/product/${resource.handle}`,
          handle: resource.handle,
          kind: 'product',
        };
      }

      const resolved = mapMenuUrl(item?.url);
      if (!resolved) return null;

      const isExternal = /^(?:https?:|mailto:|tel:)/i.test(resolved);

      return {
        id,
        label,
        to: resolved,
        kind: isExternal ? 'external' : 'link',
        external: isExternal,
      };
    })
    .filter(Boolean);
}

const NAVIGATION_QUERY = `#graphql
  query NavigationMenu($handle: String!) {
    menu(handle: $handle) {
      items {
        id
        title
        url
        resource {
          __typename
          ... on Collection { handle }
          ... on Product { handle }
        }
      }
    }
  }
`;

export function getDefaultMenuItems() {
  return defaultMenuItems.map((item) => ({ ...item }));
}

export async function fetchNavigationMenu(handle: string | null = null) {
  const menuHandle =
    handle ?? getEnv('SHOPIFY_NAV_MENU_HANDLE', 'main-menu');

  if (!menuHandle) {
    return getDefaultMenuItems();
  }

  try {
    const data = await graphql(NAVIGATION_QUERY, { handle: menuHandle });
    const items = mapMenuItems(data?.menu?.items || []);

    if (!items.length) {
      return getDefaultMenuItems();
    }

    const includesAll = items.some((item: any) => item?.kind === 'all');
    if (!includesAll) {
      const defaults = getDefaultMenuItems();
      return [defaults[0], ...items];
    }

    return items;
  } catch (error) {
    console.error(`Failed to fetch Shopify menu "${menuHandle}"`, error);
    return getDefaultMenuItems();
  }
}

/* ================= COLLECTIONS & PRODUCTS ================= */

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts($limit: Int!) {
    products(first: $limit, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        handle
        title
        description
        descriptionHtml
        vendor
        productType
        tags
        featuredImage { url altText }
        images(first: 12) { nodes { url altText } }
        media(first: 6, sortKey: POSITION) {
          nodes {
            __typename
            id
            alt
            mediaContentType
            previewImage { url altText }
            ... on MediaImage {
              image { url altText }
            }
            ... on Video {
              sources { url mimeType format width height }
            }
            ... on ExternalVideo {
              embedUrl
              host
              originUrl
            }
          }
        }
        priceRange {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount currencyCode }
        }
        options { name values }
        variants(first: 100) {
          nodes {
            id
            title
            availableForSale
            sku
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            selectedOptions { name value }
          }
        }
        collections(first: 10) { nodes { id handle title } }
        metafields(identifiers: [
          { namespace: "custom", key: "shipping_and_payment" },
          { namespace: "custom", key: "shipping_payment" },
          { namespace: "custom", key: "shipping" },
          { namespace: "custom", key: "details_and_care" },
          { namespace: "custom", key: "details_care" },
          { namespace: "custom", key: "care" },
          { namespace: "custom", key: "highlights" },
          { namespace: "custom", key: "highlight" },
          { namespace: "custom", key: "product_highlights" },
          { namespace: "custom", key: "product_highlight" },
          { namespace: "custom", key: "highlights_json" },
          { namespace: "custom", key: "coupons" },
          { namespace: "custom", key: "coupon_codes" },
          { namespace: "custom", key: "discounts" },
          { namespace: "custom", key: "offers" },
          { namespace: "custom", key: "promos" },
          { namespace: "details", key: "coupons" },
          { namespace: "details", key: "offers" },
          { namespace: "global", key: "coupons" },
          { namespace: "theme", key: "coupons" }
        ]) {
          key
          namespace
          type
          value
        }
      }
    }
  }
`;

export async function fetchAllProducts(limit = 100) {
  const data = await graphql(ALL_PRODUCTS_QUERY, { limit });
  const nodes = filterVisibleNodes(data?.products?.nodes ?? []);
  return nodes.map(normalizeProductNode).filter(Boolean);
}

export async function fetchCollections(limit = 8) {
  const q = `#graphql
  query Collections($limit:Int!) {
    collections(first:$limit, sortKey:UPDATED_AT) {
      nodes {
        id
        handle
        title
        description
        image { url altText }
        products(first:1){ nodes { featuredImage { url altText } } }
      }
    }
  }`;
  const data = await graphql(q, { limit });
  const nodes = data?.collections?.nodes ?? [];
  return nodes.map(mapCollectionNode).filter(Boolean);
}

export async function fetchCollectionByHandle(handle: string, limit = 24) {
  const q = `#graphql
  query Collection($handle:String!, $limit:Int!) {
    collection(handle:$handle) {
      id
      title
      handle
      description
      image { url altText }
      products(first:$limit) {
        nodes {
          id
          handle
          title
          description
          descriptionHtml
          vendor
          productType
          featuredImage { url altText }
          images(first: 12) { nodes { url altText } }
          media(first: 6, sortKey: POSITION) {
            nodes {
              __typename
              id
              alt
              mediaContentType
              previewImage { url altText }
              ... on MediaImage {
                image { url altText }
              }
              ... on Video {
                sources { url mimeType format width height }
              }
              ... on ExternalVideo {
                embedUrl
                host
                originUrl
              }
            }
          }
          priceRange { minVariantPrice { amount currencyCode } }
          tags
          options { name values }
          variants(first: 50) {
            nodes {
              id
              availableForSale
              selectedOptions { name value }
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              sku
            }
          }
          collections(first: 5) { nodes { id handle title } }
        }
      }
    }
  }`;
  const data = await graphql(q, { handle, limit });
  const collection = data?.collection;
  if (!collection) return null;
  const mapped = mapCollectionNode(collection);
  if (!mapped) return null;
  return {
    ...mapped,
    products:
      collection.products?.nodes
        ?.map(normalizeProductNode)
        ?.filter(Boolean) ?? [],
  };
}

export async function fetchProductByHandle(handle: string) {
  const q = `#graphql
  query ($handle:String!) {
    product(handle:$handle) {
      id
      handle
      title
      vendor
      productType
      description
      descriptionHtml

      featuredImage { url altText }
      images(first: 25) { nodes { url altText } }
      media(first: 6, sortKey: POSITION) {
        nodes {
          __typename
          id
          alt
          mediaContentType
          previewImage { url altText }
          ... on MediaImage {
            image { url altText }
          }
          ... on Video {
            sources { url mimeType format width height }
          }
          ... on ExternalVideo {
            embedUrl
            host
            originUrl
          }
        }
      }
      collections(first: 5) { nodes { id handle title } }

      priceRange { minVariantPrice { amount currencyCode } }

      options { name values }

      variants(first:20) {
        nodes {
          id
          title
          availableForSale
          sku
          selectedOptions { name value }
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
        }
      }

      metafield(namespace:"reviews", key:"json") { value }

      metafields(identifiers: [
        { namespace: "custom",  key: "subheading" },
        { namespace: "custom",  key: "subtitle" },
        { namespace: "custom",  key: "sub_title" },
        { namespace: "custom",  key: "sub-heading" },
        { namespace: "custom",  key: "tagline" },

        { namespace: "details", key: "subheading" },
        { namespace: "details", key: "subtitle" },
        { namespace: "details", key: "sub_title" },
        { namespace: "details", key: "sub-heading" },
        { namespace: "details", key: "tagline" },

        { namespace: "info",    key: "subheading" },
        { namespace: "info",    key: "subtitle" },
        { namespace: "info",    key: "sub_title" },
        { namespace: "info",    key: "sub-heading" },
        { namespace: "info",    key: "tagline" },

        { namespace: "global",  key: "subheading" },
        { namespace: "global",  key: "subtitle" },
        { namespace: "global",  key: "sub_title" },
        { namespace: "global",  key: "sub-heading" },
        { namespace: "global",  key: "tagline" },

        { namespace: "theme",   key: "subheading" },
        { namespace: "theme",   key: "subtitle" },
        { namespace: "theme",   key: "sub_title" },
        { namespace: "theme",   key: "sub-heading" },
        { namespace: "theme",   key: "tagline" },

        { namespace: "custom",  key: "shipping_and_payment" },
        { namespace: "custom",  key: "shipping_payment" },
        { namespace: "custom",  key: "shipping-and-payment" },
        { namespace: "custom",  key: "shipping_and_delivery" },
        { namespace: "custom",  key: "shipping_delivery" },
        { namespace: "custom",  key: "shipping_policy" },
        { namespace: "custom",  key: "shipping" },
        { namespace: "custom",  key: "payment" },
        { namespace: "custom",  key: "delivery" },
        { namespace: "details", key: "shipping_and_payment" },
        { namespace: "details", key: "shipping_payment" },
        { namespace: "details", key: "shipping" },

        { namespace: "custom",  key: "details_and_care" },
        { namespace: "custom",  key: "details_care" },
        { namespace: "custom",  key: "details-and-care" },
        { namespace: "custom",  key: "details-care" },
        { namespace: "custom",  key: "care_and_details" },
        { namespace: "custom",  key: "care_details" },
        { namespace: "custom",  key: "care_instructions" },
        { namespace: "custom",  key: "care" },
        { namespace: "custom",  key: "details" },
        { namespace: "details", key: "details_and_care" },
        { namespace: "details", key: "details_care" },
        { namespace: "details", key: "care" },

        { namespace: "custom",  key: "materials" },
        { namespace: "custom",  key: "material" },
        { namespace: "custom",  key: "fabric_weight" },
        { namespace: "custom",  key: "weight" },
        { namespace: "custom",  key: "wash_care" },
        { namespace: "custom",  key: "size_chart_json" },
        { namespace: "custom",  key: "size_chart" },
        { namespace: "custom",  key: "sizechart" },
        { namespace: "custom",  key: "shoe_size_chart" },
        { namespace: "custom",  key: "shoe_sizechart" },
        { namespace: "custom",  key: "mens_shoe_size_chart" },
        { namespace: "custom",  key: "mens_shoe_sizechart" },
        { namespace: "custom",  key: "size_chart_url" },

        { namespace: "details", key: "materials" },
        { namespace: "details", key: "material" },
        { namespace: "details", key: "sole" },
        { namespace: "details", key: "lining" },
        { namespace: "details", key: "colour" },
        { namespace: "details", key: "color" },
        { namespace: "details", key: "type_of_shoe" },
        { namespace: "details", key: "origin" },
        { namespace: "custom", key: "origin" },
        { namespace: "info", key: "origin" },
        { namespace: "global", key: "origin" },
        { namespace: "theme", key: "origin" },
        { namespace: "custom", key: "highlights" },
        { namespace: "custom", key: "highlight" },
        { namespace: "custom", key: "product_highlights" },
        { namespace: "custom", key: "product_highlight" },
        { namespace: "custom", key: "highlights_json" },
        { namespace: "custom", key: "coupons" },
        { namespace: "custom", key: "coupon_codes" },
        { namespace: "custom", key: "discounts" },
        { namespace: "custom", key: "offers" },
        { namespace: "custom", key: "promos" },
        { namespace: "details", key: "coupons" },
        { namespace: "details", key: "offers" },
        { namespace: "global", key: "coupons" },
        { namespace: "theme", key: "coupons" },
        { namespace: "clarte", key: "coupons" }
      ]) {
        key
        namespace
        type
        value
        reference {
          __typename
          ... on MediaImage { image { url altText } }
          ... on GenericFile { url }
        }
      }

      seo { description }
      tags
      vendor
    }
  }`;
  const data = await graphql(q, { handle });
  return normalizeProductNode(data?.product ?? null);
}

export function getSubheadingFromProduct(product: any) {
  if (!product) return null;
  const metas = Array.isArray(product.metafields) ? product.metafields : [];

  const wantedKeys = new Set([
    'subheading',
    'subtitle',
    'sub_title',
    'sub-heading',
    'tagline',
  ]);
  const allowedNS = new Set(['custom', 'details', 'info', 'global', 'theme']);

  const strip = (s = '') =>
    String(s).replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim();

  const isPlaceholder = (s = '') =>
    /^(sub[-\s]?heading|subtitle|sub[-\s]?title|tagline)$/i.test(strip(s));

  const normalize = (val: any) => {
    const raw = String(val || '').trim();
    if (!raw || isPlaceholder(raw)) return null;
    return /<\/?[a-z][\s\S]*>/i.test(raw) ? { html: raw } : { text: raw };
  };

  for (const m of metas) {
    const key = String(m?.key || '').toLowerCase();
    const ns = String(m?.namespace || '').toLowerCase();
    if (wantedKeys.has(key) && allowedNS.has(ns) && m?.value) {
      const out = normalize(m.value);
      if (out) return out;
    }
  }

  if (product.seo?.description && !isPlaceholder(product.seo.description)) {
    const out = normalize(product.seo.description);
    if (out) return out;
  }

  const plain = strip(product.descriptionHtml) || strip(product.description);
  if (plain) {
    const firstSentence = plain.split(/(?<=[.!?])\s+/)[0].slice(0, 160);
    if (!isPlaceholder(firstSentence)) return { text: firstSentence };
  }

  return null;
}

export async function searchProducts(query: string, limit = 20) {
  const q = `#graphql
  query Search($query:String!, $limit:Int!) {
    products(first:$limit, query:$query) {
      nodes {
        id
        handle
        title
        featuredImage { url altText }
        priceRange { minVariantPrice { amount currencyCode } }
        tags
      }
    }
  }`;
  const data = await graphql(q, { query, limit });
  return filterVisibleNodes(data?.products?.nodes || []);
}

/* ---------- FULL FIELDS (for cards & fallbacks) ---------- */
export async function searchProductsWithOptions(term: string, limit = 20) {
  const q = `#graphql
  query SearchWithOptions($query:String!, $limit:Int!) {
    products(first:$limit, query:$query) {
      nodes {
        id
        handle
        title
        productType
        description
        featuredImage { url altText }
        images(first: 10) { nodes { url altText } }
        priceRange { minVariantPrice { amount currencyCode } }
        options { name values }
        variants(first: 50) {
          nodes {
            id
            availableForSale
            selectedOptions { name value }
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
          }
        }
        tags
      }
    }
  }`;
  const data = await graphql(q, { query: term, limit });
  return filterVisibleNodes(data?.products?.nodes || []);
}

/* Tag helpers */
function buildTagQuery(tag: string) {
  const safe = String(tag ?? '').replace(/'/g, "\\'");
  return `tag:'${safe}'`;
}

export async function fetchProductsByTag(tag: string, limit = 20, withOptions = true) {
  const term = buildTagQuery(tag);
  return withOptions
    ? searchProductsWithOptions(term, limit)
    : searchProducts(term, limit);
}

/* ================= CART ================= */

const bundlePricingPreviewCache = new Map<string, any>();
const bundlePricingPreviewInFlight = new Map<string, Promise<any>>();

export async function cartCreate(lines: any[] = []) {
  const q = `#graphql
  mutation($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        discountCodes {
          code
          applicable
        }
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        lines(first: 100) {
          nodes {
            id
            quantity
            attributes {
              key
              value
            }
            cost {
              subtotalAmount { amount currencyCode }
              totalAmount { amount currencyCode }
            }
            discountAllocations {
              __typename
              discountedAmount { amount currencyCode }
              targetType
              ... on CartAutomaticDiscountAllocation {
                title
              }
              ... on CartCustomDiscountAllocation {
                title
              }
              ... on CartCodeDiscountAllocation {
                code
              }
            }
            merchandise {
              __typename
              ... on ProductVariant {
                id
                title
                sku
                product { id handle title featuredImage { url altText } }
                price { amount currencyCode }
                selectedOptions { name value }
                availableForSale
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }`;

  const input = {
    lines,
    buyerIdentity: {
      countryCode: (getEnv('SHOPIFY_COUNTRY', 'US')).toUpperCase(),
    },
  };
  const data = await graphql(q, { input });
  const errors = data?.cartCreate?.userErrors || [];
  if (errors.length) {
    throw new Error(errors.map((e: any) => e.message).join('; '));
  }
  return data?.cartCreate?.cart || null;
}

const normaliseBundlePreviewCounts = (counts: any[] | number = []): number[] =>
  Array.from(
    new Set(
      (Array.isArray(counts) ? counts : [counts])
        .map((count) => Number.parseInt(String(count), 10))
        .filter((count) => Number.isFinite(count) && count > 1)
    )
  ).sort((a, b) => a - b);

const getBundlePreviewCacheKey = (merchandiseId: string, counts: number[]) =>
  `${String(merchandiseId ?? '').trim()}::${counts.join(',')}`;

const normaliseDiscountTitle = (value: any) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const matchesBundleDiscountTitle = (value: any, count: number) => {
  const title = normaliseDiscountTitle(value);
  if (!title) return false;

  const numericCount = String(Math.max(1, Math.floor(Number(count) || 1)));
  const compressed = title.replace(/\s+/g, '');

  return (
    compressed.includes(`pack${numericCount}`) ||
    compressed.includes(`${numericCount}pack`) ||
    compressed.includes(`bundle${numericCount}`) ||
    compressed.includes(`${numericCount}bundle`) ||
    new RegExp(`\\bpack\\s*${numericCount}\\b`, 'i').test(title) ||
    new RegExp(`\\b${numericCount}\\s*pack\\b`, 'i').test(title) ||
    new RegExp(`\\bbundle\\s*${numericCount}\\b`, 'i').test(title) ||
    new RegExp(`\\b${numericCount}\\s*bundle\\b`, 'i').test(title)
  );
};

const getEffectiveBundleDiscountRate = (line: any, count: number) => {
  const subtotal = parseAmount(line?.cost?.subtotalAmount?.amount);
  const total = parseAmount(line?.cost?.totalAmount?.amount);
  const allocations = Array.isArray(line?.discountAllocations) ? line.discountAllocations : [];

  const matchingAllocations = allocations.filter((allocation: any) => {
    const label = allocation?.title ?? allocation?.code ?? '';
    return matchesBundleDiscountTitle(label, count);
  });

  const relevantAllocations =
    matchingAllocations.length > 0
      ? matchingAllocations
      : allocations.length === 1
        ? allocations
        : [];

  const discountedAmount = relevantAllocations.reduce(
    (sum: number, allocation: any) => sum + parseAmount(allocation?.discountedAmount?.amount),
    0
  );

  const discountAmount =
    discountedAmount > 0
      ? discountedAmount
      : subtotal > total
        ? subtotal - total
        : 0;

  if (subtotal <= 0 || discountAmount <= 0) return 0;
  return Math.max(0, Math.min(1, discountAmount / subtotal));
};

const previewBundleDiscountRate = async (merchandiseId: string, count: number) => {
  const validMerchandiseId = String(merchandiseId ?? '').trim();
  const numericCount = Math.max(1, Math.floor(Number(count) || 1));

  if (!validMerchandiseId || numericCount <= 1) {
    return 0;
  }

  const cacheKey = `${validMerchandiseId}::${numericCount}`;
  if (bundlePricingPreviewCache.has(cacheKey)) {
    return bundlePricingPreviewCache.get(cacheKey);
  }

  if (bundlePricingPreviewInFlight.has(cacheKey)) {
    return bundlePricingPreviewInFlight.get(cacheKey);
  }

  const request = (async () => {
    try {
      const cart = await cartCreate([
        {
          merchandiseId: validMerchandiseId,
          quantity: numericCount,
          attributes: [
            {
              key: 'bundle_preview_count',
              value: String(numericCount),
            },
          ],
        },
      ]);

      const previewLine = Array.isArray(cart?.lines?.nodes) ? cart.lines.nodes[0] : null;
      const rate = getEffectiveBundleDiscountRate(previewLine, numericCount);
      bundlePricingPreviewCache.set(cacheKey, rate);
      return rate;
    } catch (error) {
      console.warn(`Failed to preview Shopify bundle discount rate for ${numericCount}`, error);
      bundlePricingPreviewCache.set(cacheKey, 0);
      return 0;
    } finally {
      bundlePricingPreviewInFlight.delete(cacheKey);
    }
  })();

  bundlePricingPreviewInFlight.set(cacheKey, request);
  return request;
};

export async function previewBundleDiscountRates(merchandiseId: string, counts: number[] = [2, 3]) {
  const validMerchandiseId = String(merchandiseId ?? '').trim();
  const validCounts = normaliseBundlePreviewCounts(counts);

  if (!validMerchandiseId || !validCounts.length) {
    return {};
  }

  const cacheKey = getBundlePreviewCacheKey(validMerchandiseId, validCounts);
  if (bundlePricingPreviewCache.has(cacheKey)) {
    return bundlePricingPreviewCache.get(cacheKey);
  }

  if (bundlePricingPreviewInFlight.has(cacheKey)) {
    return bundlePricingPreviewInFlight.get(cacheKey);
  }

  const request = (async () => {
    try {
      const entries = await Promise.all(
        validCounts.map(async (count) => {
          const rate = await previewBundleDiscountRate(validMerchandiseId, count);
          return [count, rate];
        })
      );
      const rates = Object.fromEntries(entries);
      bundlePricingPreviewCache.set(cacheKey, rates);
      return rates;
    } catch (error) {
      console.warn('Failed to preview Shopify bundle discount rates', error);
      const fallback = validCounts.reduce((acc: Record<number, number>, count) => {
        acc[count] = 0;
        return acc;
      }, {});
      bundlePricingPreviewCache.set(cacheKey, fallback);
      return fallback;
    } finally {
      bundlePricingPreviewInFlight.delete(cacheKey);
    }
  })();

  bundlePricingPreviewInFlight.set(cacheKey, request);
  return request;
}

export async function cartQuery(id: string) {
  const q = `#graphql
  query($id: ID!) {
    cart(id:$id) {
      id
      checkoutUrl
      totalQuantity
      attributes {
        key
        value
      }
      buyerIdentity {
        email
        phone
      }
      discountCodes {
        code
        applicable
      }
      cost {
        subtotalAmount { amount currencyCode }
        totalAmount { amount currencyCode }
      }
      lines(first: 100) {
        nodes {
          id
          quantity
          cost { totalAmount { amount currencyCode } }
          merchandise {
            __typename
            ... on ProductVariant {
              id
              title
              sku
              product { id handle title featuredImage { url altText } }
              price { amount currencyCode }
              selectedOptions { name value }
              availableForSale
            }
          }
        }
      }
    }
  }`;
  const data = await graphql(q, { id });
  return data?.cart || null;
}

export async function cartLinesAdd(cartId: string, lines: any[]) {
  const q = `#graphql
  mutation($cartId:ID!, $lines:[CartLineInput!]!){
    cartLinesAdd(cartId:$cartId, lines:$lines){
      cart{ id }
      userErrors{ field message }
    }
  }`;
  return (await graphql(q, { cartId, lines })).cartLinesAdd;
}

export async function cartLinesUpdate(cartId: string, lines: any[]) {
  const q = `#graphql
  mutation($cartId:ID!, $lines:[CartLineUpdateInput!]!){
    cartLinesUpdate(cartId:$cartId, lines:$lines){
      cart{ id }
      userErrors{ field message }
    }
  }`;
  return (await graphql(q, { cartId, lines })).cartLinesUpdate;
}

export async function cartLinesRemove(cartId: string, lineIds: string[]) {
  const q = `#graphql
  mutation($cartId:ID!, $lineIds:[ID!]!){
    cartLinesRemove(cartId:$cartId, lineIds:$lineIds){
      cart{ id }
      userErrors{ field message }
    }
  }`;
  return (await graphql(q, { cartId, lineIds })).cartLinesRemove;
}

export async function cartDiscountCodesUpdate(cartId: string, discountCodes: string[]) {
  const q = `#graphql
  mutation($cartId:ID!, $discountCodes:[String!]!){
    cartDiscountCodesUpdate(cartId:$cartId, discountCodes:$discountCodes){
      cart{ id }
      userErrors{ field message }
    }
  }`;
  return (await graphql(q, { cartId, discountCodes })).cartDiscountCodesUpdate;
}

export async function cartAttributesUpdate(cartId: string, attributes: any[]) {
  const q = `#graphql
  mutation($cartId:ID!, $attributes:[AttributeInput!]!){
    cartAttributesUpdate(cartId:$cartId, attributes:$attributes){
      cart{ id }
      userErrors{ field message }
    }
  }`;
  return (await graphql(q, { cartId, attributes })).cartAttributesUpdate;
}

export async function cartBuyerIdentityUpdate(cartId: string, buyerIdentity: any) {
  const q = `#graphql
  mutation($cartId:ID!, $buyerIdentity:CartBuyerIdentityInput!){
    cartBuyerIdentityUpdate(cartId:$cartId, buyerIdentity:$buyerIdentity){
      cart{ id }
      userErrors{ field message }
    }
  }`;
  return (await graphql(q, { cartId, buyerIdentity })).cartBuyerIdentityUpdate;
}

/* ================= CUSTOMERS (AUTH) ================= */

export async function customerCreate({ email, password, firstName, lastName }: any) {
  const q = `#graphql
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input:$input) {
      customer { id email firstName lastName }
      customerUserErrors { code field message }
      userErrors { field message }
    }
  }`;
  const res = await graphql(q, { input: { email, password, firstName, lastName } });
  const errors = res?.customerCreate?.customerUserErrors || res?.customerCreate?.userErrors;
  if (errors && errors.length > 0) {
    throw new Error(errors[0].message || "Failed to create account.");
  }
  return res?.customerCreate?.customer ?? null;
}

export async function customerAccessTokenCreate(emailOrInput: any, password?: string) {
  const input = typeof emailOrInput === "string" ? { email: emailOrInput, password } : emailOrInput;
  const q = `#graphql
  mutation($input:CustomerAccessTokenCreateInput!){
    customerAccessTokenCreate(input:$input){
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { code field message }
      userErrors { field message }
    }
  }`;
  const res = await graphql(q, { input });
  const errors = res?.customerAccessTokenCreate?.customerUserErrors || res?.customerAccessTokenCreate?.userErrors;
  if (errors && errors.length > 0) {
    throw new Error(errors[0].message || "Invalid email or password.");
  }
  return res?.customerAccessTokenCreate?.customerAccessToken ?? null;
}

export async function getCustomer(customerAccessToken: string) {
  const q = `#graphql
  query getCustomer($token: String!){
    customer(customerAccessToken: $token){
      id
      firstName
      lastName
      email
      phone
      orders(first: 10) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }`;
  const res = await graphql(q, { token: customerAccessToken });
  return res?.customer ?? null;
}

export async function customerAccessTokenDelete(accessToken: string) {
  const q = `#graphql
  mutation customerAccessTokenDelete($accessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $accessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors { field message }
    }
  }`;
  try {
    return await graphql(q, { accessToken });
  } catch (err) {
    console.warn("Error deleting customer access token:", err);
  }
}

/* ================= HELPERS FOR DYNAMIC SECTIONS ================= */

export async function fetchProductsFromCollection(handle: string, limit = 12) {
  const q = `#graphql
  query($handle:String!, $limit:Int!) {
    collection(handle:$handle) {
      id
      title
      handle
      products(first:$limit) {
        nodes {
          id
          handle
          title
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
          tags
        }
      }
    }
  }`;
  const res = await graphql(q, { handle, limit });
  return filterVisibleNodes(res.collection?.products?.nodes || []);
}

export async function fetchTriptychProducts(limit = 12) {
  const term = [
    "tag:'icons'",
    "tag:'icon'",
    'tag:"icons-that-last"',
    'tag:"icons that last"',
  ].join(' OR ');

  let items = await searchProductsWithOptions(term, limit);

  if (!items || items.length < limit) {
    items = await fetchProductsByTag('featured', limit, true);
  }
  if (!items || items.length < limit) {
    try {
      let pool = await fetchProductsFromCollection('frontpage', limit * 2);
      if (!pool || pool.length === 0) {
        const cols = await fetchCollections(5);
        for (const c of cols || []) {
          pool = await fetchProductsFromCollection(c.handle, limit * 2);
          if (pool && pool.length) break;
        }
      }
      items = pool?.slice(0, limit) || [];
    } catch {
      items = [];
    }
  }
  return items || [];
}

export async function fetchGetTheLook(limit = 2) {
  const term = ["tag:'get-the-look'", "tag:'get the look'", "tag:'look'"].join(
    ' OR '
  );
  let items = await searchProductsWithOptions(term, limit);

  if (!items || items.length < limit) {
    items = await fetchProductsByTag('featured', limit, true);
  }
  if (!items || items.length < limit) {
    try {
      let pool = await fetchProductsFromCollection('frontpage', limit * 3);
      if (!pool || pool.length === 0) {
        const cols = await fetchCollections(5);
        for (const c of cols || []) {
          pool = await fetchProductsFromCollection(c.handle, limit * 3);
          if (pool && pool.length) break;
        }
      }
      items = pool?.slice(0, limit) || [];
    } catch {
      items = [];
    }
  }
  return items || [];
}

export async function fetchGalleryProducts(limit = 12) {
  let items = await fetchProductsByTag('gallery', limit, true);
  if (!items || items.length === 0) {
    items = await fetchProductsByTag('featured', limit, true);
  }
  return items || [];
}

/* ================= VALUE SLIDES (METAOBJECTS) ================= */

export async function fetchValueSlides(limit = 4, type = 'value_slide') {
  const q = `#graphql
  query ValueSlides($limit:Int!, $type:String!) {
    metaobjects(first: $limit, type: $type) {
      nodes {
        id
        handle
        title: field(key: "title") { value }
        body:  field(key: "body")  { value }
        image: field(key: "image") {
          value
          reference {
            __typename
            ... on MediaImage { image { url altText } }
            ... on GenericFile { url }
          }
        }
      }
    }
  }`;

  const data = await graphql(q, { limit, type });
  const nodes = data?.metaobjects?.nodes || [];

  return nodes.map((n: any) => {
    const ref = n?.image?.reference;
    let imgUrl = '';
    let altText = '';

    if (ref?.__typename === 'MediaImage') {
      imgUrl = ref?.image?.url || '';
      altText = ref?.image?.altText || '';
    } else if (ref?.__typename === 'GenericFile') {
      imgUrl = ref?.url || '';
    }

    if (!imgUrl) {
      const v = n?.image?.value || '';
      if (typeof v === 'string' && /^https?:\/\//i.test(v)) {
        imgUrl = v;
      }
    }

    return {
      id: n.id,
      key: n.handle || n.id,
      title: n?.title?.value || '',
      body: n?.body?.value || '',
      img: imgUrl,
      alt: altText,
    };
  });
}

/* ================= BLOGS ================= */

export async function fetchBlogs(limit = 10) {
  const q = `#graphql
  query Blogs($limit: Int!) {
    blogs(first: $limit) {
      edges {
        node {
          id
          handle
          title
          articles(first: 1) {
            edges {
              node {
                title
                excerptHtml
                image { url altText }
              }
            }
          }
        }
      }
    }
  }`;
  const data = await graphql(q, { limit });
  return data?.blogs?.edges ?? [];
}

export async function fetchBlogByHandle(handle: string, postsLimit = 50) {
  const q = `#graphql
  query BlogByHandle($handle: String!, $postsLimit: Int!) {
    blog(handle: $handle) {
      id
      title
      handle
      articles(first: $postsLimit) {
        nodes {
          id
          title
          handle
          publishedAt
          excerptHtml
          contentHtml
          image { url altText }
        }
      }
    }
  }`;
  try {
    const data = await graphql(q, { handle, postsLimit });
    return data?.blog ?? null;
  } catch (error) {
    console.error(`Error in fetchBlogByHandle("${handle}")`, error);
    return null;
  }
}

export async function fetchArticlesFromBlog(blogHandle: string, limit = 10) {
  const q = `#graphql
  query ArticlesFromBlog($blogHandle: String!, $limit: Int!) {
    blog(handle: $blogHandle) {
      articles(first: $limit) {
        edges {
          node {
            id
            title
            handle
            publishedAt
            excerptHtml
            featuredImage: image { url altText }
            linked_product: metafield(namespace: "custom", key: "linked_product") {
              reference { ... on Product { handle } }
            }
          }
        }
      }
    }
  }`;
  try {
    const data = await graphql(q, { blogHandle, limit });
    return data?.blog?.articles?.edges || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

/* ================= RECOMMENDATIONS & PAGINATION ================= */

export async function fetchRecommendedProducts(productOrId: any, limit = 8) {
  const isObject = typeof productOrId === 'object' && productOrId !== null;
  const productId = isObject ? productOrId.id : productOrId;
  const productHandle = isObject ? productOrId.handle : null;
  const collectionHandles: string[] = isObject
    ? (productOrId.collections ?? [])
      .map((c: any) => c?.handle)
      .filter(Boolean)
    : [];

  const q = `#graphql
  query($productId: ID!) {
    productRecommendations(productId: $productId) {
      id
      handle
      title
      featuredImage { url altText }
      priceRange { minVariantPrice { amount currencyCode } }
      tags
    }
  }`;

  const normaliseList = (nodes: any[] = []): any[] =>
    (nodes || []).map(normalizeProductNode).filter(Boolean);

  let products: any[] = [];

  if (productId) {
    try {
      const data = await graphql(q, { productId });
      products = normaliseList(filterVisibleNodes(data.productRecommendations || []));
    } catch (error) {
      console.warn('fetchRecommendedProducts: primary query failed', error);
    }
  }

  const dedupeAndTrim = (nodes: any[] = []): any[] => {
    const seen = new Set<string>();
    const out: any[] = [];
    for (const node of nodes) {
      if (!node || !node.handle) continue;
      if (productHandle && node.handle === productHandle) continue;
      if (seen.has(node.handle)) continue;
      seen.add(node.handle);
      out.push(node);
      if (out.length >= limit) break;
    }
    return out;
  };

  if (!products.length) {
    for (const handle of collectionHandles) {
      try {
        const fallback = normaliseList(
          await fetchProductsFromCollection(handle, limit + 3)
        );
        if (fallback.length) {
          products = fallback;
          break;
        }
      } catch (error) {
        console.warn(
          `fetchRecommendedProducts: collection fallback failed (${handle})`,
          error
        );
      }
    }
  }

  if (!products.length) {
    try {
      const fallback = normaliseList(await fetchAllProducts(limit + 3));
      products = fallback;
    } catch (error) {
      console.warn('fetchRecommendedProducts: all products fallback failed', error);
    }
  }

  return dedupeAndTrim(products);
}

