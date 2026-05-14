import type { NextConfig } from "next";

/**
 * Compass-only Next config. The parent Mantle marketing site
 * (heymantle.com) proxies `/compass/*` and `/templates/*` here via
 * its own `next.config.ts` rewrites, so this app serves at those
 * paths on its own deploy as well (no `basePath` needed — internal
 * links throughout Compass code already use `/compass/...` and
 * `/templates/...`).
 *
 * Redirects below preserve historical Compass URLs (renames during
 * the Frameworks → Methods + Reality → Foundation + Manuals
 * restructure). The Mantle marketing-site rewrites/redirects
 * (`/ops`, `/compare`, `/systems`, `/results`, `/features`,
 * `/use-cases/*`) stay in the Mantle repo — they don't belong
 * here.
 */
const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  async redirects() {
    return [
      // Frameworks renamed to Methods. Old /compass/frameworks/* URLs
      // 308 to the new /compass/methods/* surface so external links
      // and search indexes carry over cleanly.
      { source: "/compass/frameworks",                    destination: "/compass/methods",         permanent: true },
      { source: "/compass/frameworks/:slug*",             destination: "/compass/methods/:slug*",  permanent: true },
      // Catch the old singular `/compass/framework` too — was a
      // separate static page (now deleted); fold it into Methods.
      { source: "/compass/framework",                     destination: "/compass/methods",         permanent: true },

      // Manuals moved under /compass/* with a new 7-manual structure.
      // The four old manuals map to the first four new manuals by
      // position (the old chapter slugs don't 1:1 with the new chapter
      // slugs, so chapter URLs redirect to the manual root rather
      // than a specific chapter that may not exist).
      { source: "/manuals/think-like-a-founder",          destination: "/compass/foundation", permanent: true },
      { source: "/manuals/think-like-a-founder/:path*",   destination: "/compass/foundation", permanent: true },

      // Reality renamed to Foundation. 308 the old route + every
      // chapter URL so external links keep working without a 404.
      { source: "/compass/reality",                       destination: "/compass/foundation",         permanent: true },
      { source: "/compass/reality/:slug*",                destination: "/compass/foundation/:slug*",  permanent: true },
      { source: "/manuals/get-to-real-demand",            destination: "/compass/shape",   permanent: true },
      { source: "/manuals/get-to-real-demand/:path*",     destination: "/compass/shape",   permanent: true },
      { source: "/manuals/build-your-first-mvp",          destination: "/compass/build",   permanent: true },
      { source: "/manuals/build-your-first-mvp/:path*",   destination: "/compass/build",   permanent: true },
      { source: "/manuals/polish-your-product",           destination: "/compass/launch",  permanent: true },
      { source: "/manuals/polish-your-product/:path*",    destination: "/compass/launch",  permanent: true },
      // Any other /manuals/* URL falls back to the Compass manuals
      // index. /manuals at root → /compass/manuals (the listing).
      { source: "/manuals",                               destination: "/compass/manuals", permanent: true },
      { source: "/manuals/:path*",                        destination: "/compass/manuals", permanent: true },

      // Bare root: visiting the standalone Compass deploy directly
      // (e.g. compass-mantle.vercel.app) redirects to the Compass
      // home so it never lands on an empty page. On heymantle.com
      // proper, `/` is the Mantle marketing site — that lives in
      // a different deployment and is unaffected.
      { source: "/",                                      destination: "/compass",         permanent: false },
    ];
  },
};

export default nextConfig;
