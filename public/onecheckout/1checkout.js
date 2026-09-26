(() => {
  "use strict";

  if (window.__oneCheckoutNextLoaded) return;
  window.__oneCheckoutNextLoaded = true;

  const runtimeConfig = window.__ONE_CHECKOUT_CONFIG__ || {};
  const API_HOST = String(runtimeConfig.apiHost || "").replace(/\/+$/, "");
  const CHECKOUT_HOST = String(runtimeConfig.checkoutHost || "").replace(/\/+$/, "");
  const API_KEY = String(runtimeConfig.apiKey || "");
  const CART_KEY = "clarte_cart_items";
  const SHOPIFY_CART_ID_KEY = "clarte_shopify_cart_id";
  const COUPON_KEY = "clarte_applied_coupon";
  const QUERY_STORAGE_KEY = "queryparams_1c";
  const DISABLED_STORAGE_KEY = "d1c";
  const TARGET_LABELS = new Set(["buy now", "buy it now", "checkout", "proceed to checkout"]);
  const replacements = new Map();
  const loaderMessages = [
    "Carefully wrapping your items",
    "Crossing T's & dotting I's",
    "Juuust a moment...",
    "Adding the cherry on top",
  ];

  let checkoutId = null;
  let checkoutUrl = null;
  let checkoutCart = null;
  let activeSource = null;
  let messageTimer = null;
  let iframeTimer = null;
  let messageIndex = 0;
  let bodyScrollState = null;
  let backgroundInteractionState = [];
  let previouslyFocusedElement = null;
  let clientIp = null;

  function setExpiringStorage(key, value, expiryHours) {
    const expires = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toUTCString();
    localStorage.setItem(key, JSON.stringify({ value, expires }));
  }

  function getExpiringStorage(key) {
    try {
      const stored = JSON.parse(localStorage.getItem(key));
      if (Date.parse(stored.expires) > Date.now()) return stored.value;
      localStorage.removeItem(key);
    } catch {}
    return null;
  }

  function readCookie(name) {
    const prefix = `${name}=`;
    const row = decodeURIComponent(document.cookie)
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(prefix));
    return row ? row.slice(prefix.length) : null;
  }

  function seedFbcCookie() {
    try {
      const fbclid = new URL(window.location.href).searchParams.get("fbclid");
      if (!fbclid) return;
      const current = readCookie("_fbc");
      if (current && current.split(".").slice(3).join(".") === fbclid) return;
      const domain = window.location.hostname.replace(/^www\./, "");
      document.cookie = `_fbc=fb.1.${Date.now()}.${fbclid}; max-age=${90 * 24 * 3600}; domain=.${domain}; path=/; SameSite=Lax`;
    } catch {}
  }

  function getAttributionParams() {
    const current = Object.fromEntries(new URL(window.location.href).searchParams.entries());
    if (Object.keys(current).length) {
      const saved = getExpiringStorage(QUERY_STORAGE_KEY) || {};
      const merged = { ...saved, ...current };
      setExpiringStorage(QUERY_STORAGE_KEY, merged, 24 * 7);
      return merged;
    }
    return getExpiringStorage(QUERY_STORAGE_KEY) || {};
  }

  const attributionParams = getAttributionParams();
  seedFbcCookie();

  function cleanButtonText(button) {
    return (button.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function isTargetButton(button) {
    if (!(button instanceof HTMLButtonElement)) return false;
    if (button.dataset.onecheckoutReplacement || button.closest(".checkoutmodal")) return false;
    const text = cleanButtonText(button);
    if (TARGET_LABELS.has(text)) return true;
    const aria = (button.getAttribute("aria-label") || "").trim().toLowerCase();
    return aria.startsWith("buy now ");
  }

  function createReplacement(source) {
    if (source.dataset.onecheckoutManaged === "true" || !source.parentElement) return;

    const replacement = source.cloneNode(true);
    replacement.removeAttribute("id");
    replacement.removeAttribute("disabled");
    replacement.dataset.onecheckoutReplacement = "true";
    replacement.classList.add("onecheckout-replacement");
    replacement.setAttribute("aria-describedby", "onecheckout-button-purpose");
    replacement.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      beginCheckout(source, replacement);
    });

    source.dataset.onecheckoutManaged = "true";
    source.classList.add("dc-none");
    source.before(replacement);
    replacements.set(source, replacement);
  }

  function scanButtons(root = document) {
    const buttons = root instanceof HTMLButtonElement ? [root] : root.querySelectorAll?.("button") || [];
    buttons.forEach((button) => {
      if (isTargetButton(button)) createReplacement(button);
    });

    for (const [source, replacement] of replacements) {
      if (!source.isConnected) {
        replacement.remove();
        replacements.delete(source);
      } else {
        source.classList.add("dc-none");
        const shouldDisable = source.disabled && !cleanButtonText(source).includes("redirecting");
        if (replacement.disabled !== shouldDisable) replacement.disabled = shouldDisable;
      }
    }
  }

  const domObserver = new MutationObserver((mutations) => {
    let shouldScan = false;
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes.length) shouldScan = true;
      if (mutation.type === "attributes" && mutation.target instanceof HTMLButtonElement) shouldScan = true;
    }
    if (shouldScan) requestAnimationFrame(() => scanButtons());
  });

  function parseMoney(value) {
    const normalized = String(value || "0").replace(/[^0-9.,-]/g, "").replace(/,/g, "");
    const amount = Number.parseFloat(normalized);
    return Number.isFinite(amount) ? Math.round(amount * 100) : 0;
  }

  function numericShopifyId(value) {
    const match = String(value || "").match(/(\d+)(?:\?.*)?$/);
    return match ? Number(match[1]) : value || "";
  }

  function normalizeCartItem(item) {
    const quantity = Math.max(1, Number(item.quantity) || 1);
    const unitPrice = parseMoney(item.price);
    const variantId = numericShopifyId(item.merchandiseId || item.variantId || item.id);
    const productId = numericShopifyId(item.productId || item.id || item.merchandiseId);
    return {
      id: variantId,
      variant_id: variantId,
      product_id: productId,
      quantity,
      title: item.title || "Product",
      product_title: item.title || "Product",
      variant_title: item.variantTitle || item.size || "Default Title",
      price: unitPrice,
      final_price: unitPrice,
      line_price: unitPrice * quantity,
      final_line_price: unitPrice * quantity,
      currency: "INR",
      sku: item.sku || "",
      url: item.url || "",
      image: item.image || "",
      featured_image: item.image ? { url: item.image, alt: item.alt || item.title || "" } : null,
      properties: item.properties || {},
    };
  }

  function makeCart(items) {
    const normalized = items.map(normalizeCartItem);
    const totalPrice = normalized.reduce((sum, item) => sum + item.final_line_price, 0);
    const rawToken = localStorage.getItem(SHOPIFY_CART_ID_KEY) || crypto.randomUUID();
    const token = `${Math.floor(Math.random() * 1000000)}-${rawToken}`;
    const coupon = localStorage.getItem(COUPON_KEY) || "";
    return {
      token,
      cart_token: rawToken,
      note: null,
      attributes: {},
      original_total_price: totalPrice,
      total_price: totalPrice,
      total_discount: 0,
      total_weight: 0,
      item_count: normalized.reduce((sum, item) => sum + item.quantity, 0),
      items: normalized,
      requires_shipping: true,
      currency: "INR",
      discount_codes: coupon ? [{ code: coupon, amount: "0.00" }] : [],
    };
  }

  function getStoredCart() {
    try {
      const items = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  }

  function findProductContext(source) {
    const aria = source.getAttribute("aria-label") || "";
    const ariaTitle = aria.replace(/^buy now\s*/i, "").trim();
    const routeMatch = window.location.pathname.match(/^\/products?\/([^/?#]+)/i);
    const link = source.closest("article, [role='dialog'], main, section")?.querySelector("a[href*='/product/']");
    const hrefMatch = link?.getAttribute("href")?.match(/^\/products?\/([^/?#]+)/i);
    const container = source.closest("article, [role='dialog'], main, section");
    const headings = Array.from(container?.querySelectorAll("h1, h2, h3") || []);
    const heading = headings.find((node) => !node.classList.contains("sr-only"))?.textContent?.trim() || "";
    return {
      handle: decodeURIComponent(routeMatch?.[1] || hrefMatch?.[1] || ""),
      title: ariaTitle || heading,
    };
  }

  async function getBuyNowItem(source) {
    const context = findProductContext(source);
    const params = new URLSearchParams();
    if (context.handle) params.set("handle", context.handle);
    if (context.title) params.set("title", context.title);
    const response = await fetch(`/api/onecheckout/product?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("This product could not be prepared for checkout.");
    const item = await response.json();
    return {
      id: item.id,
      merchandiseId: item.variantId,
      title: item.title,
      variantTitle: item.variantTitle,
      price: item.price,
      image: item.image,
      url: item.url,
      quantity: 1,
    };
  }

  function isBuyNow(source) {
    return cleanButtonText(source).includes("buy") || (source.getAttribute("aria-label") || "").toLowerCase().startsWith("buy now");
  }

  async function beginCheckout(source, replacement) {
    if (replacement.dataset.onecheckoutLoading === "true") return;
    replacement.dataset.onecheckoutLoading = "true";
    replacement.disabled = true;
    activeSource = source;

    try {
      const items = isBuyNow(source) ? [await getBuyNowItem(source)] : getStoredCart();
      if (!items.length) throw new Error("Your cart is empty.");
      checkoutCart = makeCart(items);
      openModal();
      await initializeCheckout();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Unable to continue with checkout.", false);
      replacement.dataset.onecheckoutLoading = "false";
      replacement.disabled = source.disabled;
    }
  }

  function modalToggle() {
    return document.getElementById("checkoutModal");
  }

  function isModalOpen() {
    return modalToggle()?.checked === true;
  }

  function getModal() {
    return document.querySelector(".checkoutmodal");
  }

  function getModalFocusableElements() {
    const modal = getModal();
    if (!modal) return [];
    return Array.from(
      modal.querySelectorAll(
        "button:not([disabled]), iframe, a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
      )
    ).filter((element) => !element.closest(".dc-none"));
  }

  function focusModalSurface() {
    const modal = getModal();
    if (!modal) return;
    const iframe = modal.querySelector("iframe:not(.dc-none)");
    (iframe || modal).focus({ preventScroll: true });
  }

  function disableBackgroundInteraction() {
    if (backgroundInteractionState.length) return;
    const modal = getModal();
    if (!modal) return;

    previouslyFocusedElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    backgroundInteractionState = Array.from(document.body.children)
      .filter((element) => element !== modal)
      .map((element) => ({
        element,
        inert: element.inert,
        ariaHidden: element.getAttribute("aria-hidden"),
      }));

    backgroundInteractionState.forEach(({ element }) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });
    document.body.classList.add("onecheckout-modal-open");
    modal.setAttribute("aria-hidden", "false");

    requestAnimationFrame(() => {
      focusModalSurface();
    });
  }

  function restoreBackgroundInteraction() {
    const modal = getModal();
    backgroundInteractionState.forEach(({ element, inert, ariaHidden }) => {
      element.inert = inert;
      if (ariaHidden === null) element.removeAttribute("aria-hidden");
      else element.setAttribute("aria-hidden", ariaHidden);
    });
    backgroundInteractionState = [];
    document.body.classList.remove("onecheckout-modal-open");
    modal?.setAttribute("aria-hidden", "true");

    const focusTarget = previouslyFocusedElement;
    previouslyFocusedElement = null;
    if (focusTarget?.isConnected) {
      requestAnimationFrame(() => focusTarget.focus({ preventScroll: true }));
    }
  }

  function guardModalPointer(event) {
    if (!isModalOpen()) return;
    const modal = getModal();
    const target = event.target;
    if (!(target instanceof Element) || !modal) return;

    if (!modal.contains(target) || (target === modal && !target.closest(".inner"))) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  function trapModalFocus(event) {
    if (!isModalOpen()) return;

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = getModalFocusableElements();
    if (!focusable.length) {
      event.preventDefault();
      focusModalSurface();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !focusable.includes(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !focusable.includes(active))) {
      event.preventDefault();
      first.focus();
    }
  }

  function keepFocusInsideModal(event) {
    if (!isModalOpen()) return;
    const modal = getModal();
    if (modal?.contains(event.target)) return;
    focusModalSurface();
  }

  function lockBodyScroll() {
    if (bodyScrollState) return;
    const scrollY = window.scrollY || 0;
    bodyScrollState = {
      scrollY,
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      htmlOverflow: document.documentElement.style.overflow,
    };
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    window.lenis?.stop?.();
  }

  function unlockBodyScroll() {
    if (!bodyScrollState) return;
    const state = bodyScrollState;
    document.documentElement.style.overflow = state.htmlOverflow;
    document.body.style.overflow = state.overflow;
    document.body.style.position = state.position;
    document.body.style.top = state.top;
    document.body.style.width = state.width;
    bodyScrollState = null;
    window.scrollTo(0, state.scrollY);
    window.lenis?.start?.();
  }

  function resetProgress() {
    const line = document.querySelector(".checkout-progressbar .line");
    if (!line) return;
    line.classList.remove("progress-crawl");
    line.style.transition = "none";
    line.style.width = "0%";
    void line.offsetWidth;
    line.style.transition = "";
  }

  function startProgress() {
    const progress = document.querySelector(".checkout-progressbar");
    const line = progress?.querySelector(".line");
    progress?.classList.remove("dc-none");
    if (!line) return;
    resetProgress();
    requestAnimationFrame(() => {
      line.style.width = "75%";
      window.setTimeout(() => {
        line.classList.add("progress-crawl");
        line.style.width = "100%";
      }, 400);
    });
  }

  function startMessages() {
    window.clearInterval(messageTimer);
    messageIndex = 0;
    messageTimer = window.setInterval(() => {
      const message = document.getElementById("checkoutLoadingMessage");
      if (message) message.textContent = loaderMessages[messageIndex % loaderMessages.length];
      messageIndex += 1;
    }, 1200);
  }

  function openModal() {
    const toggle = modalToggle();
    const splash = document.querySelector(".checkoutmodal .splash-screen");
    const iframe = document.querySelector(".checkoutmodal iframe");
    if (!toggle) throw new Error("Checkout modal is unavailable.");
    toggle.checked = true;
    disableBackgroundInteraction();
    splash?.classList.remove("dc-none");
    iframe?.classList.add("dc-none");
    lockBodyScroll();
    startProgress();
    startMessages();
  }

  function resetModal(removeIframe = true) {
    window.clearInterval(messageTimer);
    window.clearTimeout(iframeTimer);
    messageTimer = null;
    iframeTimer = null;
    messageIndex = 0;
    resetProgress();
    document.querySelector(".checkout-progressbar")?.classList.add("dc-none");
    const message = document.getElementById("checkoutLoadingMessage");
    if (message) {
      message.className = "";
      message.textContent = "Crafting your cart";
    }
    const toggle = modalToggle();
    if (toggle) toggle.checked = false;
    const iframe = document.querySelector(".checkoutmodal iframe");
    if (removeIframe) iframe?.remove();
    unlockBodyScroll();
    restoreBackgroundInteraction();
    if (activeSource) {
      const replacement = replacements.get(activeSource);
      if (replacement) {
        replacement.dataset.onecheckoutLoading = "false";
        replacement.disabled = activeSource.disabled;
      }
    }
    checkoutId = null;
    checkoutUrl = null;
  }

  function showError(message, retry = true) {
    const toggle = modalToggle();
    if (toggle && !toggle.checked) toggle.checked = true;
    disableBackgroundInteraction();
    lockBodyScroll();
    window.clearInterval(messageTimer);
    window.clearTimeout(iframeTimer);
    document.querySelector(".checkout-progressbar")?.classList.add("dc-none");
    const target = document.getElementById("checkoutLoadingMessage");
    if (!target) return;
    target.className = "onecheckout-error";
    target.replaceChildren(document.createTextNode(message));
    if (retry) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "onecheckout-retry";
      button.textContent = "Retry checkout";
      button.addEventListener("click", () => {
        target.className = "";
        target.textContent = "Crafting your cart";
        startProgress();
        startMessages();
        initializeCheckout();
      });
      target.append(document.createElement("br"), button);
    }
  }

  async function apiRequest(url, options, timeoutMs = 5000, retries = 1) {
    let attempt = 0;
    while (attempt <= retries) {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          const error = new Error(data.message || data.error || "Checkout request failed.");
          error.status = response.status;
          error.data = data;
          if (attempt < retries && (response.status === 408 || response.status === 429 || response.status >= 500)) {
            attempt += 1;
            continue;
          }
          throw error;
        }
        return data;
      } catch (error) {
        if (attempt < retries && (error.name === "AbortError" || !error.status || error.status >= 500)) {
          attempt += 1;
          continue;
        }
        throw error;
      } finally {
        window.clearTimeout(timeout);
      }
    }
  }

  function shouldFallback(error) {
    const status = Number(error?.status) || 0;
    const message = String(error?.message || "").toLowerCase();
    return error?.name === "AbortError" || [401, 403, 404].includes(status) || message.includes("merchant not active") || message.includes("invalid api key") || message.includes("unauthorized");
  }

  function triggerOriginalCheckout() {
    const source = activeSource;
    resetModal(true);
    if (source?.isConnected) {
      source.click();
      return;
    }
    window.location.href = "/cart";
  }

  async function initializeCheckout() {
    if (!checkoutCart?.items?.length) {
      showError("Your cart is empty.", false);
      return;
    }
    if (!API_KEY || !API_HOST || !CHECKOUT_HOST) {
      showError("1Checkout configuration is missing. Please contact the store administrator.", false);
      return;
    }

    const payload = { ...checkoutCart, ...attributionParams };
    try {
      const data = await apiRequest(`${API_HOST}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-LOGISY-API-KEY": API_KEY,
        },
        body: JSON.stringify(payload),
      });
      checkoutId = data.checkout_id;
      checkoutUrl = data.checkout_url;
      loadCheckoutIframe({ showError: false, checkout_type: "checkout" });
    } catch (error) {
      if (shouldFallback(error)) {
        triggerOriginalCheckout();
      } else {
        showError(error?.message || "Temporary issue. Please retry.", true);
      }
    }
  }

  function loadCheckoutIframe(params) {
    const inner = document.querySelector(".checkoutmodal .inner");
    const container = document.querySelector(".checkoutmodal .iframe-container");
    if (!inner || !container) return;

    const url = new URL(`${CHECKOUT_HOST}/v4/checkout/widget/`);
    const allParams = {
      ...params,
      containerheight: inner.offsetHeight || 720,
      apikey: API_KEY,
      discount: new URLSearchParams(window.location.search).get("discount"),
      ...attributionParams,
    };
    Object.entries(allParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") url.searchParams.set(key.toLowerCase(), String(value));
    });
    if (clientIp) url.searchParams.set("ip", clientIp);
    const cookieParams = { fbclid: readCookie("_fbc"), fbp: readCookie("_fbp"), ga: readCookie("_ga"), __tr_clid: readCookie("__tr_clid") };
    Object.entries(cookieParams).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    url.searchParams.set("url", window.location.href);

    let iframe = container.querySelector("iframe");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.name = "oneCheckoutIframe";
      iframe.loading = "eager";
      iframe.title = "1Checkout secure checkout";
      container.appendChild(iframe);
    }
    iframe.classList.add("dc-none");
    iframe.onload = checkoutLoaded;
    iframe.onerror = () => showError("Checkout could not load.", true);
    iframe.src = url.href;
    window.clearTimeout(iframeTimer);
    iframeTimer = window.setTimeout(() => showError("Checkout is taking longer than expected.", true), 12000);
  }

  function checkoutLoaded() {
    window.clearTimeout(iframeTimer);
    const iframe = document.querySelector(".checkoutmodal iframe");
    if (!iframe) return;
    iframe.classList.remove("dc-none");
    document.querySelector(".checkoutmodal .splash-screen")?.classList.add("dc-none");
    window.clearInterval(messageTimer);
    resetProgress();
    iframe.focus({ preventScroll: true });
    const message = {
      checkout_id: checkoutId,
      checkout_url: checkoutUrl,
      token: checkoutCart?.token,
      shopify_cart_token: checkoutCart?.cart_token,
      topic: "1CHECKOUTDATA",
    };
    const post = () => iframe.contentWindow?.postMessage(message, CHECKOUT_HOST);
    post();
    window.setTimeout(post, 100);
  }

  function clearLocalCart() {
    localStorage.setItem(CART_KEY, "[]");
    localStorage.removeItem(SHOPIFY_CART_ID_KEY);
    window.dispatchEvent(new CustomEvent("cart-updated"));
  }

  function loadRazorpay(config) {
    const open = () => {
      const iframe = document.querySelector(".checkoutmodal iframe");
      const instance = new window.Razorpay({
        ...config,
        handler: () => iframe?.contentWindow?.postMessage({ topic: "RAZORPAYSUCCESS" }, CHECKOUT_HOST),
      });
      instance.on("payment.failed", () => iframe?.contentWindow?.postMessage({ topic: "RAZORPAYFAILURE" }, CHECKOUT_HOST));
      instance.open();
    };
    if (window.Razorpay) return open();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = open;
    document.body.appendChild(script);
  }

  function handleCheckoutMessage(event) {
    if (event.origin !== CHECKOUT_HOST || event.data?.topic !== "1CHECKOUT") return;
    const data = event.data;
    switch (data.message) {
      case "launch_truecaller":
        window.location.href = data.truecallerDeeplink;
        break;
      case "launch_upi_app":
        window.location.href = data.deeplink;
        break;
      case "exit_checkout":
        resetModal(true);
        if (data.nextPage) window.location.replace(data.nextPage);
        break;
      case "clear_cart":
        clearLocalCart();
        break;
      case "gift_card_redirect":
        window.location.href = data.url;
        break;
      case "redirect_to_shopify_checkout":
        triggerOriginalCheckout();
        break;
      case "order_url_redirection":
        window.setTimeout(() => window.location.replace(data.nextPage), 1000);
        break;
      case "open_razorpay":
        loadRazorpay(data.rzpConfig);
        break;
      case "iframe_launched":
        try {
          window.fbq?.("track", "InitiateCheckout", {
            content_type: "product_group",
            content_ids: data.cartProductIds,
            value: data.totalCartValue,
            contents: data.cartItemDetails,
            num_items: data.cartItemCount,
            currency: data.currency,
          }, { eventID: data.event_id });
          window.gtag?.("event", "begin_checkout", {
            transaction_id: `1C_begin_checkout_${data.checkoutId}`,
            value: data.totalCartValue,
            currency: data.currency || "INR",
            items: data.cartItemDetails,
          });
        } catch {}
        break;
      case "payment_initiated":
        try {
          window.fbq?.("track", "AddPaymentInfo", { value: data.totalCartValue, currency: data.currency || "INR" }, { eventID: data.event_id });
          window.gtag?.("event", "add_payment_info", { value: data.totalCartValue, currency: data.currency || "INR" });
        } catch {}
        break;
      case "order_placed":
        clearLocalCart();
        try {
          window.fbq?.("track", "Purchase", { value: data.totalCartValue, currency: data.currency || "INR" }, { eventID: data.event_id });
          window.gtag?.("event", "purchase", { transaction_id: data.orderId || data.checkoutId, value: data.totalCartValue, currency: data.currency || "INR" });
        } catch {}
        break;
      default:
        break;
    }
  }

  function init() {
    if (getExpiringStorage(DISABLED_STORAGE_KEY)) return;
    scanButtons();
    domObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["disabled"] });
    document.addEventListener("pointerdown", guardModalPointer, true);
    document.addEventListener("click", guardModalPointer, true);
    document.addEventListener("keydown", trapModalFocus, true);
    document.addEventListener("focusin", keepFocusInsideModal, true);
    window.addEventListener("message", handleCheckoutMessage, false);
    window.addEventListener("pagehide", () => resetModal(true));
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) resetModal(true);
      scanButtons();
    });
    window.addEventListener("cart-updated", () => requestAnimationFrame(() => scanButtons()));
    fetch("https://api64.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => { clientIp = data.ip || null; })
      .catch(() => {});
    if (CHECKOUT_HOST) fetch(`${CHECKOUT_HOST}/health`).catch(() => {});
    if (API_HOST) fetch(`${API_HOST}/health`).catch(() => {});
  }

  window.oneCheckout = {
    initialize1Checkout: initializeCheckout,
    checkoutLoaded,
    close: () => resetModal(true),
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
