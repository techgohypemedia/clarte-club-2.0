// Shared by the root layout (server) and ScrollVideoHero (client)
export const HERO_LOADER_SEEN_KEY = "clarte-hero-loader-seen-v2"

// Runs in <head> before first paint: marks <html> for returning visitors so the server-rendered hero loader
// never flashes. Lives in the root layout (rendered once on the server), because a <script> inside a client
// component is never executed when React renders it in the browser (e.g. navigating back to the homepage).
export const HERO_LOADER_SEEN_SCRIPT = `try{if(localStorage.getItem(${JSON.stringify(HERO_LOADER_SEEN_KEY)})==="1")document.documentElement.setAttribute("data-hero-seen","1")}catch(e){}`
