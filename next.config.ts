import type { NextConfig } from "next";

/**
 * Compass-only Next config. The parent Mantle marketing site
 * (heymantle.com) proxies the Compass routes to this app via its
 * own Netlify `_redirects`. This app serves the final IA URLs
 * directly:
 *
 *   /compass           — Compass home (the section overview)
 *   /manuals[/slug]    — manual covers + chapter routes
 *   /workflows[/slug]  — workflow library
 *   /templates[/slug]  — template library
 *   /blog[/slug]       — insights (nav label = "Insights", route = /blog)
 *
 * Redirects below preserve every historical URL that may have been
 * shared, indexed by Google, or linked from another Mantle surface.
 * Three rename waves are captured: Frameworks → Methods → Workflows,
 * Reality → Foundation → Clarity, and the route hoist out of
 * `/compass/*` to the new top-level slots.
 */
const nextConfig: NextConfig = {
  /* TypeScript + ESLint errors fail the build. The `react/no-
     unescaped-entities` ESLint rule is disabled in
     `eslint.config.mjs` because it flags every quote/apostrophe in
     JSX text — noise in a content-heavy codebase. */
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },

  async redirects() {
    return [
      // ───────────────────────────────────────────────────────────
      // Route hoist — /compass/* sections moved to top-level slots.
      // ───────────────────────────────────────────────────────────
      { source: "/compass/manuals",                       destination: "/manuals",                    permanent: true },
      { source: "/compass/manuals/:slug*",                destination: "/manuals/:slug*",             permanent: true },
      { source: "/compass/templates",                     destination: "/templates",                  permanent: true },
      { source: "/compass/templates/:slug*",              destination: "/templates/:slug*",           permanent: true },
      { source: "/compass/insights",                      destination: "/blog",                       permanent: true },
      { source: "/compass/insights/:slug*",               destination: "/blog/:slug*",                permanent: true },
      { source: "/insights",                              destination: "/blog",                       permanent: true },
      { source: "/insights/:slug*",                       destination: "/blog/:slug*",                permanent: true },
      // Answers surface retired entirely (no detail pages were built).
      { source: "/compass/answers",                       destination: "/compass",                    permanent: true },
      { source: "/compass/answers/:slug*",                destination: "/compass",                    permanent: true },

      // ───────────────────────────────────────────────────────────
      // Frameworks → Methods → Workflows (three renames, all map
      // forward to the final /workflows surface).
      // ───────────────────────────────────────────────────────────
      { source: "/compass/methods",                       destination: "/workflows",                  permanent: true },
      { source: "/compass/methods/:slug*",                destination: "/workflows/:slug*",           permanent: true },
      { source: "/methods",                               destination: "/workflows",                  permanent: true },
      { source: "/methods/:slug*",                        destination: "/workflows/:slug*",           permanent: true },
      { source: "/compass/frameworks",                    destination: "/workflows",                  permanent: true },
      { source: "/compass/frameworks/:slug*",             destination: "/workflows/:slug*",           permanent: true },
      { source: "/compass/framework",                     destination: "/workflows",                  permanent: true },
      { source: "/frameworks",                            destination: "/workflows",                  permanent: true },
      { source: "/frameworks/:slug*",                     destination: "/workflows/:slug*",           permanent: true },

      // ───────────────────────────────────────────────────────────
      // Manual renames — Reality → Foundation → Clarity at slug 0.
      // Other manuals (Shape, Build, Launch, Monetize, Grow, Operate)
      // keep their slugs.
      // ───────────────────────────────────────────────────────────
      { source: "/compass/foundation",                    destination: "/manuals/clarity",            permanent: true },
      { source: "/compass/foundation/:slug*",             destination: "/manuals/clarity/:slug*",     permanent: true },
      { source: "/manuals/foundation",                    destination: "/manuals/clarity",            permanent: true },
      { source: "/manuals/foundation/:slug*",             destination: "/manuals/clarity/:slug*",     permanent: true },
      { source: "/compass/reality",                       destination: "/manuals/clarity",            permanent: true },
      { source: "/compass/reality/:slug*",                destination: "/manuals/clarity/:slug*",     permanent: true },
      { source: "/manuals/reality",                       destination: "/manuals/clarity",            permanent: true },
      { source: "/manuals/reality/:slug*",                destination: "/manuals/clarity/:slug*",     permanent: true },

      // ───────────────────────────────────────────────────────────
      // Other compass/* manual slugs that moved to top-level /manuals.
      // ───────────────────────────────────────────────────────────
      { source: "/compass/shape",                         destination: "/manuals/shape",              permanent: true },
      { source: "/compass/shape/:slug*",                  destination: "/manuals/shape/:slug*",       permanent: true },
      { source: "/compass/build",                         destination: "/manuals/build",              permanent: true },
      { source: "/compass/build/:slug*",                  destination: "/manuals/build/:slug*",       permanent: true },
      { source: "/compass/launch",                        destination: "/manuals/launch",             permanent: true },
      { source: "/compass/launch/:slug*",                 destination: "/manuals/launch/:slug*",      permanent: true },
      { source: "/compass/monetize",                      destination: "/manuals/monetize",           permanent: true },
      { source: "/compass/monetize/:slug*",               destination: "/manuals/monetize/:slug*",    permanent: true },
      { source: "/compass/grow",                          destination: "/manuals/grow",               permanent: true },
      { source: "/compass/grow/:slug*",                   destination: "/manuals/grow/:slug*",        permanent: true },
      { source: "/compass/operate",                       destination: "/manuals/operate",            permanent: true },
      { source: "/compass/operate/:slug*",                destination: "/manuals/operate/:slug*",     permanent: true },

      // ───────────────────────────────────────────────────────────
      // Pre-Compass /manuals/* slugs from the legacy static site.
      // The four old manuals map by position to the first four new
      // manuals (chapter slugs don't 1:1; redirect to manual root).
      // ───────────────────────────────────────────────────────────
      { source: "/manuals/think-like-a-founder",          destination: "/manuals/clarity",            permanent: true },
      { source: "/manuals/think-like-a-founder/:path*",   destination: "/manuals/clarity",            permanent: true },
      { source: "/manuals/get-to-real-demand",            destination: "/manuals/shape",              permanent: true },
      { source: "/manuals/get-to-real-demand/:path*",     destination: "/manuals/shape",              permanent: true },
      { source: "/manuals/build-your-first-mvp",          destination: "/manuals/build",              permanent: true },
      { source: "/manuals/build-your-first-mvp/:path*",   destination: "/manuals/build",              permanent: true },
      { source: "/manuals/polish-your-product",           destination: "/manuals/launch",             permanent: true },
      { source: "/manuals/polish-your-product/:path*",    destination: "/manuals/launch",             permanent: true },

      // ───────────────────────────────────────────────────────────
      // Coming-soon manuals — Build / Launch / Monetize / Grow /
      // Operate. Their cover cards render on `/compass` + `/manuals`
      // as non-clickable `<div aria-disabled="true">` (handled in
      // `ManualCoverGrid` + `ManualRowList`), but direct URL access
      // (typed, bookmarked, or chained from a legacy `/compass/build`
      // redirect that lands at `/manuals/build`) would 404.
      //
      // Redirect those to `/manuals` (the cover index) so visitors
      // see the full manual line-up instead of a 404. `permanent:
      // false` (302) so crawlers don't cache the redirect — when a
      // manual launches and `comingSoon` flips to false, removing
      // the redirect immediately re-exposes the real route without
      // search engines holding a stale 301 in their index.
      //
      // Both `/manuals/<slug>` and `/manuals/<slug>/<chapter>` need
      // a redirect — the latter catches legacy chapter URLs from
      // old static-site exports or external links.
      //
      // Remove the matching entry below when a manual ships content.
      // ───────────────────────────────────────────────────────────
      { source: "/manuals/build",                         destination: "/manuals",                    permanent: false },
      { source: "/manuals/build/:path*",                  destination: "/manuals",                    permanent: false },
      { source: "/manuals/launch",                        destination: "/manuals",                    permanent: false },
      { source: "/manuals/launch/:path*",                 destination: "/manuals",                    permanent: false },
      { source: "/manuals/monetize",                      destination: "/manuals",                    permanent: false },
      { source: "/manuals/monetize/:path*",               destination: "/manuals",                    permanent: false },
      { source: "/manuals/grow",                          destination: "/manuals",                    permanent: false },
      { source: "/manuals/grow/:path*",                   destination: "/manuals",                    permanent: false },
      { source: "/manuals/operate",                       destination: "/manuals",                    permanent: false },
      { source: "/manuals/operate/:path*",                destination: "/manuals",                    permanent: false },

      // ───────────────────────────────────────────────────────────
      // Slug renames per the May SEO sheet — the new slugs are
      // longer/more-specific (`build-a-real-app-business` vs
      // `can-you-build-a-real-business`, `test-app-demand` vs
      // `test-demand`, etc.) so search engines find the page on the
      // app-builder query. Permanent 301s preserve link equity from
      // any external link still pointing at the old slugs.
      //
      // The `/manuals/app-clarity/...` path appears as a one-off in
      // the SEO sheet (a single chapter — every other Clarity
      // chapter uses `/manuals/clarity/...`). Per the sheet's own
      // "preferred option," the Clarity manual stays on a single
      // parent route (`/manuals/clarity/...`) for consistency, and
      // `/manuals/app-clarity/*` redirects back to `/manuals/clarity/*`
      // so any external link to the sheet's variant lands correctly.
      // ───────────────────────────────────────────────────────────
      { source: "/manuals/clarity/can-you-build-a-real-business",  destination: "/manuals/clarity/build-a-real-app-business", permanent: true },
      { source: "/manuals/clarity/youre-not-just-a-builder",        destination: "/manuals/clarity/builder-to-founder",        permanent: true },
      { source: "/manuals/shape/test-demand",                       destination: "/manuals/shape/test-app-demand",             permanent: true },
      { source: "/manuals/shape/brand-basics",                      destination: "/manuals/shape/app-branding-basics",         permanent: true },

      // `/manuals/app-clarity/...` → `/manuals/clarity/...`
      // Catch the SEO-sheet's one-off variant + any future link to
      // the `app-clarity` parent. Maps every child path through, so
      // `/manuals/app-clarity/build-a-real-app-business` lands at
      // `/manuals/clarity/build-a-real-app-business` cleanly.
      { source: "/manuals/app-clarity",                   destination: "/manuals/clarity",            permanent: true },
      { source: "/manuals/app-clarity/:path*",            destination: "/manuals/clarity/:path*",     permanent: true },

      // Bare root → Compass home (only matters for direct hits on the
      // standalone Compass deploy URL; on heymantle.com / serves the
      // Mantle marketing site).
      { source: "/",                                      destination: "/compass",                    permanent: false },
    ];
  },
};

export default nextConfig;
