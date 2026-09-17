// Clarté Club - Considered Eyewear
"use client"

import { createPortal } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Search, ShoppingBag, UserRound, Menu, X, MapPin, Bookmark, Compass, BookOpen } from "lucide-react"
import { StoriesModal } from "@/components/home/StoriesModal"
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEventHandler,
  type MouseEventHandler,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"
import { CartSidebar } from "@/components/cart/CartSidebar"
import { SearchSidebar } from "@/components/home/SearchSidebar"
import { WishlistSidebar } from "@/components/wishlist/WishlistSidebar"
import { AuthModal, getStoredCustomerToken } from "@/components/auth/AuthModal"
import { getCartItems } from "@/lib/cart"
import { useWishlist } from "@/lib/wishlist"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { motion, AnimatePresence } from "motion/react"

type NavKey = "new_in" | "collections"
type ActiveMenu = NavKey | "wishlist"

type PrimaryNavItem = {
  key: NavKey
  label: string
  href: string
}

const primaryNav: PrimaryNavItem[] = [
  { key: "new_in", label: "New In", href: "/#new-drops" },
  { key: "collections", label: "Collections", href: "/collections" },
]

const megaMenuFeatured = ["Curated Edits", "Noir Collection", "Heritage Collection", "Crystal Collection", "Atelier Collection"]

const megaMenuCategories = [
  "Curated Edits",
  "Noir",
  "Heritage",
  "Crystal",
  "Atelier",
]

const megaMenuCards = [
  {
    src: "/images/nav1.png",
    alt: "Editorial preview for the Off Beat Edit collection",
    eyebrow: "Spotlight",
    titleLines: ["Off Beat", "Edit"],
  },
  {
    src: "/images/nav2.png",
    alt: "Editorial preview for the Country Edit collection",
    eyebrow: "New Launch",
    titleLines: ["Country", "Edit"],
  },
]

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

function NavLink({
  href,
  children,
  active = false,
  selected = false,
  mobile = false,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onClick,
  ariaHaspopup,
  ariaExpanded,
}: {
  href: string
  children: ReactNode
  active?: boolean
  selected?: boolean
  mobile?: boolean
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement>
  onMouseLeave?: MouseEventHandler<HTMLAnchorElement>
  onFocus?: FocusEventHandler<HTMLAnchorElement>
  onBlur?: FocusEventHandler<HTMLAnchorElement>
  onClick?: MouseEventHandler<HTMLAnchorElement>
  ariaHaspopup?: "menu"
  ariaExpanded?: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={selected ? "page" : undefined}
      aria-haspopup={ariaHaspopup}
      aria-expanded={ariaExpanded}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      className={cn(
        "group/link inline-flex flex-col items-start whitespace-nowrap uppercase pb-0.5 text-current transition-[color,opacity] duration-300 ease-out",
        mobile
          ? "flex-none text-[0.75rem] tracking-[0.18em]"
          : "text-[0.72rem] tracking-[0.2em]",
        active || selected ? "opacity-100" : "hover:opacity-60"
      )}
    >
      <span className="leading-none">{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "mt-[1px] h-px w-full origin-left bg-current transition-transform duration-200",
          active || selected
            ? "scale-x-100"
            : "scale-x-0 group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100"
        )}
      />
    </Link>
  )
}

function IconButton({
  label,
  children,
  tone = "dark",
  onClick,
  ariaExpanded,
  ariaHaspopup,
}: {
  label: string
  children: ReactNode
  tone?: "dark" | "light"
  onClick?: () => void
  ariaExpanded?: boolean
  ariaHaspopup?: "menu" | "dialog"
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
      onClick={onClick}
      className={cn(
        "inline-flex size-9 items-center justify-center text-current transition-[color,opacity] duration-300 ease-out hover:opacity-60 focus-visible:outline-none focus-visible:ring-2",
        tone === "light"
          ? "focus-visible:ring-white/30"
          : "focus-visible:ring-black/25"
      )}
    >
      {children}
    </button>
  )
}

function StoryRingButton({
  onClick,
  tone,
  className,
}: {
  onClick: () => void
  tone: "dark" | "light"
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="View Stories"
      title="View Stories"
      className={cn(
        "group relative flex size-8 sm:size-9 items-center justify-center rounded-full p-[2px] overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer shadow-[0_0_12px_rgba(201,176,122,0.4)] shrink-0",
        className
      )}
    >
      {/* 360-degree rotating gold conic gradient ring */}
      <span
        className="absolute inset-[-60%] animate-spin bg-[conic-gradient(from_0deg,#987C3E_0deg,#C9B07A_120deg,#F5E8C7_240deg,#987C3E_360deg)] pointer-events-none"
        style={{ animationDuration: "3.5s" }}
      />
      
      {/* Inner Icon Container */}
      <div className={cn(
        "relative z-10 flex size-full items-center justify-center rounded-full transition-colors p-1",
        tone === "light" ? "bg-black text-white" : "bg-white text-black"
      )}>
        <Image
          src="/logo.svg"
          alt="Clarté Stories"
          width={28}
          height={18}
          className={cn(
            "h-3 sm:h-3.5 w-auto object-contain transition-transform duration-300 group-hover:scale-110",
            tone === "light" ? "brightness-0 invert" : ""
          )}
        />
      </div>
    </button>
  )
}

function MobileFloatingNav({
  onOpenStories,
  onOpenWishlist,
  hidden = false,
}: {
  onOpenStories: () => void
  onOpenWishlist: () => void
  hidden?: boolean
}) {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const { count: wishlistCount } = useWishlist()
  const lastScrollY = useRef(0)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY <= 80) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY.current + 5) {
        setIsVisible(false) // Hide when scrolling down
      } else if (currentScrollY < lastScrollY.current - 5) {
        setIsVisible(true) // Show when scrolling up
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted || hidden) return null

  return createPortal(
    <div
      className={cn(
        "fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-[99999] md:hidden flex items-center gap-2.5 transition-all duration-300 ease-out select-none",
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-28 opacity-0 pointer-events-none"
      )}
    >
      {/* Light Theme Glass Pill Navigation Bar - Sized to h-11 / sm:h-12 */}
      <div className="flex h-11 sm:h-12 items-center gap-5 sm:gap-6 bg-white/95 backdrop-blur-xl border border-black/15 px-5 sm:px-6 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.15)] text-black">
        {/* Explore / Collections */}
        <Link
          href="/collections"
          aria-label="Explore Collections"
          className="text-black hover:opacity-60 transition-opacity flex items-center justify-center active:scale-95"
        >
          <Compass className="size-5 stroke-[1.8]" />
        </Link>

        {/* Our Story / About */}
        <Link
          href="/about"
          aria-label="Our Story"
          className="text-black hover:opacity-60 transition-opacity flex items-center justify-center active:scale-95"
        >
          <BookOpen className="size-5 stroke-[1.8]" />
        </Link>

        {/* Wishlist */}
        <button
          type="button"
          onClick={onOpenWishlist}
          aria-label="Wishlist"
          className="relative text-black hover:opacity-60 transition-opacity cursor-pointer flex items-center justify-center active:scale-95"
        >
          <Heart className="size-5 stroke-[1.8]" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#C9B07A] text-[8px] font-bold text-black border border-white">
              {wishlistCount}
            </span>
          )}
        </button>
      </div>

      {/* Story Ring Button (Same Gold Rotating Ring as Desktop Header) - Sized to match pill height */}
      <StoryRingButton
        onClick={onOpenStories}
        tone="dark"
        className="size-11 sm:size-12 shadow-[0_10px_35px_rgba(0,0,0,0.25)] hover:scale-110 active:scale-95 shrink-0"
      />
    </div>,
    document.body
  )
}


function MenuSection({
  title,
  items,
  open,
  onClose,
}: {
  title: string
  items: string[]
  open: boolean
  onClose: () => void
}) {
  return (
    <section className="min-w-0">
      <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-black">
        {title}
      </p>

      <ul className="mt-7 space-y-4">
        {items.map((item) => (
          <li key={item}>
            <button
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={onClose}
              className="group/item inline-flex flex-col items-start text-left text-[0.95rem] leading-none tracking-[0.01em] text-black focus-visible:outline-none hover:text-black"
            >
              <span className="leading-none">{item}</span>
              <span
                aria-hidden="true"
                className="mt-[1px] h-px w-full origin-left scale-x-0 bg-current transition-transform duration-200 group-hover/item:scale-x-100 group-focus-visible/item:scale-x-100"
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function MenuCard({
  src,
  alt,
  eyebrow,
  titleLines,
}: {
  src: string
  alt: string
  eyebrow: string
  titleLines: string[]
}) {
  return (
    <article className="relative aspect-[314/412] overflow-hidden bg-neutral-100">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 48vw, 314px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.12)_58%,rgba(0,0,0,0.28)_100%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)]">
        <span className="text-[0.95rem] font-light uppercase tracking-[0.16em]">
          {eyebrow}
        </span>
        <div className="mt-3 space-y-0.5">
          {titleLines.map((line) => (
            <div
              key={line}
              className="text-[clamp(2rem,2.7vw,3.05rem)] font-light uppercase leading-[0.9] tracking-[-0.05em]"
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function WishlistPanel() {
  return (
    <div className="h-full w-full bg-white text-black">
      <div className="mx-auto flex h-full w-full max-w-[1160px] flex-col px-6 py-8 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[0.78rem] font-medium uppercase tracking-[0.08em]">
            My Wishlist
          </h2>

          <button
            type="button"
            className="inline-flex h-8 items-center bg-black px-3 text-[0.75rem] font-medium text-white transition-opacity hover:opacity-80"
          >
            Share Wishlist
          </button>
        </div>

        <div className="flex flex-1 items-start justify-center pt-12">
          <div className="w-full bg-black px-4 py-2 text-center text-[0.78rem] text-white">
            There are no items in your Wishlist
          </div>
        </div>
      </div>
    </div>
  )
}

function getNavKeyFromHash(hash: string): NavKey | null {
  const normalized = hash.replace(/^#/, "").toLowerCase()

  if (
    normalized === "new-drops" ||
    normalized === "new_in"
  ) {
    return "new_in"
  }

  return null
}

export function Navbar({
  className,
}: {
  className?: string
}) {
  const defaultNavKey: NavKey = "new_in"
  const pathname = usePathname()
  const isVideoHero = pathname === "/"
  const isOverlay = pathname === "/"

  const safeClearHash = () => {
    if (typeof window !== "undefined" && window.location.hash) {
      try {
        const url = window.location.pathname + window.location.search;
        const state = typeof window.history.state === "object" && window.history.state !== null 
          ? window.history.state 
          : {};
        window.history.replaceState(state, document.title, url);
      } catch (err) {
        console.error("Failed to clear hash safely:", err);
      }
    }
  };

  const [isScrolled, setIsScrolled] = useState(false)
  const [isPastHero, setIsPastHero] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [storiesOpen, setStoriesOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedNav, setSelectedNav] = useState<NavKey | null>(defaultNavKey)
  const [activeMenu, setActiveMenu] = useState<ActiveMenu | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const scrollFrameRef = useRef<number | null>(null)
  const menuCloseTimeoutRef = useRef<number | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)
  const announcementHeightRef = useRef(0)
  const hasOpenMenu = Boolean(activeMenu)
  const isInteractiveSurface = isHovered || hasOpenMenu
  const isLightSurface = !isOverlay || (isVideoHero ? isPastHero : isScrolled) || isInteractiveSurface
  const tone: "dark" | "light" = isLightSurface ? "dark" : "light"
  const isWishlistOpen = wishlistOpen
  const { count: wishlistCount } = useWishlist()
  const [cartCount, setCartCount] = useState(0)
  const [cartToast, setCartToast] = useState<{
    visible: boolean
    item: {
      title: string
      image: string
      size: string
      price: string
    } | null
  }>({ visible: false, item: null })

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(Boolean(getStoredCustomerToken()))
    }
    checkAuth()
    window.addEventListener("auth-state-changed", checkAuth)
    return () => window.removeEventListener("auth-state-changed", checkAuth)
  }, [])

  useEffect(() => {
    const updateCount = () => {
      const items = getCartItems()
      const total = items.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(total)
    }

    updateCount()

    const handleCartUpdated = (e: any) => {
      updateCount()
      if (e.detail?.open) {
        setCartOpen(true)
      }
      if (e.detail?.addedItem) {
        setCartToast({
          visible: true,
          item: e.detail.addedItem,
        })
      }
    }

    window.addEventListener("cart-updated", handleCartUpdated)
    return () => window.removeEventListener("cart-updated", handleCartUpdated)
  }, [])

  useEffect(() => {
    if (cartToast.visible) {
      const t = setTimeout(() => {
        setCartToast((prev) => ({ ...prev, visible: false }))
      }, 6000)
      return () => clearTimeout(t)
    }
  }, [cartToast.visible])

  useEffect(() => {
    if (mobileMenuOpen) {
      (window as any).lenis?.stop()
      safeClearHash()
    } else {
      (window as any).lenis?.start()
    }
    return () => {
      (window as any).lenis?.start()
    }
  }, [mobileMenuOpen])

  const openMenu = (menu: NavKey) => {
    if (menuCloseTimeoutRef.current !== null) {
      window.clearTimeout(menuCloseTimeoutRef.current)
      menuCloseTimeoutRef.current = null
    }

    setIsHovered(true)
    setActiveMenu(menu)
  }

  const closeMenu = () => {
    if (menuCloseTimeoutRef.current !== null) {
      window.clearTimeout(menuCloseTimeoutRef.current)
      menuCloseTimeoutRef.current = null
    }

    setIsHovered(false)
    setActiveMenu(null)
  }

  const scheduleMenuClose = () => {
    if (menuCloseTimeoutRef.current !== null) {
      window.clearTimeout(menuCloseTimeoutRef.current)
    }

    menuCloseTimeoutRef.current = window.setTimeout(() => {
      closeMenu()
    }, 90)
  }

  const cancelMenuClose = () => {
    if (menuCloseTimeoutRef.current !== null) {
      window.clearTimeout(menuCloseTimeoutRef.current)
      menuCloseTimeoutRef.current = null
    }

    setIsHovered(true)
  }

  const toggleWishlist = () => {
    setWishlistOpen((current) => !current)
  }

  useEffect(() => {
    const updateSelectedNav = () => {
      const hash = typeof window !== "undefined" ? window.location.hash : ""
      if (pathname === "/collections" || pathname.startsWith("/collections/") || pathname.startsWith("/collection/")) {
        setSelectedNav("collections")
      } else if (pathname === "/") {
        setSelectedNav(getNavKeyFromHash(hash) ?? "new_in")
      } else {
        setSelectedNav(null)
      }
    }

    updateSelectedNav()
    window.addEventListener("hashchange", updateSelectedNav)
    window.addEventListener("popstate", updateSelectedNav)

    return () => {
      if (menuCloseTimeoutRef.current !== null) {
        window.clearTimeout(menuCloseTimeoutRef.current)
        menuCloseTimeoutRef.current = null
      }
      window.removeEventListener("hashchange", updateSelectedNav)
      window.removeEventListener("popstate", updateSelectedNav)
    }
  }, [pathname])

  useIsomorphicLayoutEffect(() => {
    const readAnnouncementHeight = () => {
      const rawValue = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--announcement-height")
        .trim()
      const parsedValue = Number.parseFloat(rawValue)

      return Number.isFinite(parsedValue) ? parsedValue : 50
    }

    const syncHeaderMetrics = () => {
      announcementHeightRef.current = readAnnouncementHeight()
    }

    const updateScrollState = () => {
      scrollFrameRef.current = null

      const nextIsScrolled = window.scrollY > announcementHeightRef.current

      const heroHeight = typeof window !== "undefined" ? window.innerHeight : 800
      const heroThreshold = isVideoHero ? heroHeight * 2.85 : announcementHeightRef.current
      const nextIsPastHero = window.scrollY > heroThreshold

      setIsScrolled((current) =>
        current === nextIsScrolled ? current : nextIsScrolled
      )
      setIsPastHero((current) =>
        current === nextIsPastHero ? current : nextIsPastHero
      )

      // Clear the hash from the address bar when scrolled near the top of the page
      if (window.scrollY < 80 && window.location.hash) {
        safeClearHash();
        setSelectedNav(defaultNavKey);
      }
    }

    const syncScrollState = () => {
      syncHeaderMetrics()
      updateScrollState()
    }

    const scheduleScrollStateUpdate = () => {
      if (scrollFrameRef.current !== null) {
        return
      }

      scrollFrameRef.current = window.requestAnimationFrame(updateScrollState)
    }

    syncScrollState()
    window.addEventListener("scroll", scheduleScrollStateUpdate, {
      passive: true,
    })
    window.addEventListener("pageshow", syncScrollState)
    window.addEventListener("resize", syncScrollState)

    return () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current)
        scrollFrameRef.current = null
      }

      window.removeEventListener("scroll", scheduleScrollStateUpdate)
      window.removeEventListener("pageshow", syncScrollState)
      window.removeEventListener("resize", syncScrollState)
    }
  }, [isOverlay, isVideoHero, pathname])

  const headerContent = (
    <header
      ref={headerRef}
      className={cn(
        "main-navbar navbar-shell border-b transition-colors duration-500 ease-in-out",
        "h-[64px] lg:h-[80px] w-full",
        hasOpenMenu
          ? "bg-white text-black border-black/5 shadow-none"
          : isLightSurface
            ? "bg-white text-black border-black/10 shadow-[0_1px_0_rgba(0,0,0,0.08)]"
            : "bg-transparent text-white border-transparent shadow-none",
        isScrolled && "is-scrolled",
        isLightSurface && "is-light-surface",
        className
      )}
    >
      <div className="relative h-full w-full px-4 sm:px-6 lg:px-8">
        <div className="hidden h-full lg:flex items-center justify-between">
          <nav
            aria-label="Primary"
            className="flex items-center gap-3.5 xl:gap-6 shrink-0"
          >
            {primaryNav.map((item) => (
              <NavLink
                key={item.key}
                href={item.href}
                active={activeMenu === item.key}
                selected={selectedNav === item.key}
                onClick={() => {
                  setSelectedNav(item.key)
                  setActiveMenu(null)
                }}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link
            href="/"
            aria-label="Clarte Club home"
            onClick={() => {
              safeClearHash()
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity hover:opacity-75 z-10"
          >
            <Image
              src="/wordmark.svg"
              alt="Clarte Club"
              width={360}
              height={34}
              priority
              className={cn(
                "block h-auto w-[9.5rem] lg:w-[10.5rem] xl:w-[12.5rem] max-w-none transition-[filter] duration-300 ease-out",
                !(isLightSurface || hasOpenMenu) && "invert"
              )}
            />
          </Link>

          <div className="flex items-center gap-2.5 xl:gap-3.5 ml-auto shrink-0">
            {/* Story Ring Button */}
            <StoryRingButton onClick={() => setStoriesOpen(true)} tone={hasOpenMenu ? "dark" : tone} />

            {/* Search Icon Button */}
            <IconButton
              label="Search"
              tone={hasOpenMenu ? "dark" : tone}
              onClick={() => setSearchOpen(true)}
              ariaHaspopup="dialog"
              ariaExpanded={searchOpen}
            >
              <Search className="size-[18px] stroke-[1.7]" />
            </IconButton>

            {/* Account Icon */}
            <IconButton
              label="Account"
              tone={hasOpenMenu ? "dark" : tone}
              onClick={() => {
                const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "shapar-ay.myshopify.com"
                window.location.href = `https://${shopifyDomain}/account/login`
              }}
            >
              <div className="relative">
                <UserRound className="size-[18px] stroke-[1.7]" />
                {isLoggedIn && (
                  <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[#C9B07A]" />
                )}
              </div>
            </IconButton>

            {/* Wishlist / Bookmark Icon */}
            <IconButton
              label="Wishlist"
              tone={hasOpenMenu ? "dark" : tone}
              onClick={toggleWishlist}
              ariaHaspopup="menu"
              ariaExpanded={isWishlistOpen}
            >
              <div className="relative">
                <Heart className="size-[18px] stroke-[1.7]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9B07A] text-[9px] font-bold text-black border border-white animate-in scale-in duration-200">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </IconButton>

            {/* Cart Icon */}
            <IconButton
              label="Cart"
              tone={hasOpenMenu ? "dark" : tone}
              onClick={() => setCartOpen(true)}
            >
              <div className="relative">
                <ShoppingBag className="size-[18px] stroke-[1.7]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9B07A] text-[9px] font-bold text-black border border-white animate-in scale-in duration-200">
                    {cartCount}
                  </span>
                )}
              </div>
            </IconButton>

            {/* Hamburger / Menu Toggle Button at the end */}
            <IconButton
              label={hasOpenMenu ? "Close Menu" : "Open Menu"}
              tone={hasOpenMenu ? "dark" : tone}
              onClick={() => {
                setActiveMenu((current) => (current ? null : "collections"))
              }}
              ariaHaspopup="menu"
              ariaExpanded={hasOpenMenu}
            >
              {hasOpenMenu ? (
                <X className="size-[20px] stroke-[1.8]" />
              ) : (
                <Menu className="size-[20px] stroke-[1.8]" />
              )}
            </IconButton>
          </div>
        </div>

        {/* Mobile Header Row */}
        <div className="grid h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center lg:hidden px-0.5">
          <div className="justify-self-start">
            <IconButton
              label="Open Menu"
              tone={tone}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="size-[20px] stroke-[1.7]" />
            </IconButton>
          </div>

          <Link
            href="/"
            aria-label="Clarte Club home"
            onClick={() => {
              safeClearHash()
            }}
            className="justify-self-center transition-opacity hover:opacity-75 min-w-0 px-1"
          >
            <Image
              src="/wordmark.svg"
              alt="Clarte Club"
              width={220}
              height={21}
              priority
              className={cn(
                "block h-auto w-[7.2rem] min-[380px]:w-[8.2rem] sm:w-[10.5rem] max-w-full transition-[filter] duration-300 ease-out",
                !isLightSurface && "invert"
              )}
            />
          </Link>

          <div className="flex items-center justify-self-end gap-1 min-[380px]:gap-1.5 sm:gap-2">
            <StoryRingButton onClick={() => setStoriesOpen(true)} tone={tone} className="hidden sm:flex" />
            <IconButton
              label="Search"
              tone={tone}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-[18px] stroke-[1.7]" />
            </IconButton>
            <IconButton
              label="Cart"
              tone={tone}
              onClick={() => setCartOpen(true)}
            >
              <div className="relative">
                <ShoppingBag className="size-[18px] stroke-[1.7]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9B07A] text-[9px] font-bold text-black border border-white animate-in scale-in duration-200">
                    {cartCount}
                  </span>
                )}
              </div>
            </IconButton>
          </div>
        </div>

        {/* Backdrop Overlay when Mega Menu is open */}
        {activeMenu && (
          <div
            className="fixed inset-0 top-[80px] bg-black/40 backdrop-blur-[2px] z-40 hidden lg:block animate-in fade-in duration-200"
            onClick={closeMenu}
          />
        )}

        {/* Floating Mega Menu Card with connected curved white background shell (Inspired by Bluorng screenshot 2) */}
        <div
          aria-hidden={!activeMenu}
          className={cn(
            "absolute inset-x-0 top-full hidden w-full bg-white rounded-b-[2.5rem] px-4 sm:px-6 lg:px-8 pt-2 pb-6 transition-all duration-300 ease-out lg:block z-50 border-b border-x border-black/5 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.18)]",
            activeMenu
              ? "pointer-events-auto opacity-100 translate-y-0"
              : "pointer-events-none opacity-0 -translate-y-2"
          )}
        >
          <div className="mx-auto max-w-[1400px] max-h-[calc(82vh-60px)] overflow-y-auto custom-scrollbar rounded-[2.25rem] bg-white p-7 sm:p-8 md:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.14)] border border-black/10 text-black">
            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr_1.2fr_1.2fr] gap-6 xl:gap-10 items-start">
              
              {/* Column 1: Main Eyewear Collections */}
              <div className="flex flex-col gap-3.5 font-heading text-[13px] font-medium tracking-[0.02em]">
                <Link href="/collections" onClick={closeMenu} className="font-bold text-black hover:opacity-70 transition-opacity">
                  New Arrivals
                </Link>
                <Link href="/collections?category=Edits" onClick={closeMenu} className="font-semibold text-black/80 hover:text-black transition-colors">
                  Curated Edits
                </Link>
                <Link href="/collections?category=Heritage" onClick={closeMenu} className="font-semibold text-black/80 hover:text-black transition-colors">
                  Heritage Collection
                </Link>
                <Link href="/collections?category=Noir" onClick={closeMenu} className="font-semibold text-black/80 hover:text-black transition-colors">
                  Noir Collection
                </Link>
                <Link href="/collections?category=Crystal" onClick={closeMenu} className="font-semibold text-black/80 hover:text-black transition-colors">
                  Crystal Collection
                </Link>
                <Link href="/collections?category=Atelier" onClick={closeMenu} className="font-semibold text-black/80 hover:text-black transition-colors">
                  Atelier Collection
                </Link>
              </div>

              {/* Column 2: Eyewear Type */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-black">Type</span>
                <div className="flex flex-wrap gap-1.5">
                  {["Sunglasses", "Eyeglasses"].map((item) => (
                    <Link
                      key={item}
                      href={`/collections?type=${item.toLowerCase()}`}
                      onClick={closeMenu}
                      className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-medium text-black/80 border border-black/5 hover:bg-black hover:text-white transition-all shadow-2xs"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Column 3: Frame Shape */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-black">Frame Shape</span>
                <div className="flex flex-wrap gap-1.5">
                  {["Aviator", "Oval", "Square", "D-Frame", "Round", "Cat-Eye", "Hexagon"].map((item) => (
                    <Link
                      key={item}
                      href={`/collections?shape=${item.toLowerCase()}`}
                      onClick={closeMenu}
                      className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-medium text-black/80 border border-black/5 hover:bg-black hover:text-white transition-all shadow-2xs"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Column 4: Material & Gender */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-black">Material</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Acetate", "Metal"].map((item) => (
                      <Link
                        key={item}
                        href={`/collections?material=${item.toLowerCase()}`}
                        onClick={closeMenu}
                        className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-medium text-black/80 border border-black/5 hover:bg-black hover:text-white transition-all shadow-2xs"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-black">Gender</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Men", "Women"].map((item) => (
                      <Link
                        key={item}
                        href={`/collections?gender=${item.toLowerCase()}`}
                        onClick={closeMenu}
                        className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-medium text-black/80 border border-black/5 hover:bg-black hover:text-white transition-all shadow-2xs"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <SearchSidebar open={searchOpen} onOpenChange={setSearchOpen} />
      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} />
      <WishlistSidebar open={wishlistOpen} onOpenChange={setWishlistOpen} />
      <StoriesModal open={storiesOpen} onClose={() => setStoriesOpen(false)} />
      <MobileFloatingNav
        onOpenStories={() => setStoriesOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        hidden={searchOpen || cartOpen || wishlistOpen || storiesOpen || mobileMenuOpen || authModalOpen}
      />


      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" showCloseButton={false} className="w-[300px] sm:w-[350px] p-0 bg-white text-black border-r border-black/10 flex flex-col h-full z-[99999]">
          <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
            <SheetTitle className="text-[12px] font-semibold uppercase tracking-[0.2em] text-black/50">
              Menu
            </SheetTitle>
            <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none cursor-pointer">
              <X className="h-5 w-5 stroke-[1.5]" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>

          <div
            data-lenis-prevent
            className="flex-1 overflow-y-auto px-6 py-8 space-y-8"
          >
            {/* Primary Nav Links */}
            <nav aria-label="Mobile Primary Navigation" className="flex flex-col gap-6">
              {primaryNav.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => {
                    setSelectedNav(item.key)
                    setMobileMenuOpen(false)
                  }}
                  className={cn(
                    "text-[18px] font-normal uppercase tracking-[0.12em] text-black hover:opacity-60 transition-opacity",
                    selectedNav === item.key && "font-semibold"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="h-px bg-black/5" />

            {/* Eyewear Categories in Menu */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/40">
                Shop By Style
              </h3>
              <div className="flex flex-col gap-3.5">
                {megaMenuCategories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/collections?category=${cat.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => {
                      setMobileMenuOpen(false)
                    }}
                    className="text-[13px] uppercase tracking-[0.08em] text-black/80 hover:text-black transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Menu Footer */}
          <div className="px-6 pt-6 pb-10 border-t border-black/5 bg-neutral-50 space-y-4">
            <div className="flex items-center justify-center gap-14">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "shapar-ay.myshopify.com"
                  window.location.href = `https://${shopifyDomain}/account/login`
                }}
                className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-black/70 hover:text-black transition-colors cursor-pointer"
              >
                <div className="relative">
                  <UserRound className="size-[15px] stroke-[1.5]" />
                  {isLoggedIn && (
                    <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-[#C9B07A]" />
                  )}
                </div>
                <span>{isLoggedIn ? "My Account" : "Account"}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  toggleWishlist()
                }}
                className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-black/70 hover:text-black transition-colors cursor-pointer"
              >
                <Heart className="size-[15px] stroke-[1.5]" />
                Wishlist
              </button>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-black/30 text-center pt-2">
              &copy; {new Date().getFullYear()} Clarte Club
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )

  return (
    <>
      {isOverlay ? (
        <div className="main-navbar-slot">{headerContent}</div>
      ) : (
        headerContent
      )}

      {/* Premium Cart Toast Notification (Desktop Only - Top Right Corner) */}
      <AnimatePresence>
        {cartToast.visible && cartToast.item && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-24 right-6 z-[99999] hidden md:flex items-center gap-3 bg-white border border-black/15 p-3 text-[#0F0F10] shadow-[0_12px_40px_rgba(0,0,0,0.18)] rounded-md w-[295px]"
          >
            <div className="relative size-12 shrink-0 bg-white border border-black/10 overflow-hidden rounded p-0.5 flex items-center justify-center">
              <Image
                src={cartToast.item.image}
                alt={cartToast.item.title}
                fill
                sizes="48px"
                className="object-contain object-center p-0.5"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[8.5px] font-bold uppercase tracking-[0.2em] text-[#C9B07A]">
                Added To Cart
              </p>
              <h4 className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[#0F0F10] truncate leading-tight">
                {cartToast.item.title}
              </h4>
              <p className="mt-1 text-[9.5px] text-neutral-500 uppercase tracking-wider font-medium">
                {cartToast.item.size} • <span className="font-semibold text-black">{cartToast.item.price}</span>
              </p>
            </div>
            <button
              onClick={() => setCartToast((prev) => ({ ...prev, visible: false }))}
              className="text-neutral-400 hover:text-black transition-colors p-1 cursor-pointer shrink-0"
              aria-label="Close notification"
            >
              <X className="size-3.5 stroke-[1.8]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  )
}
