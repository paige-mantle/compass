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

      // Bare root → Compass home (only matters for direct hits on the
      // standalone Compass deploy URL; on heymantle.com / serves the
      // Mantle marketing site).
      { source: "/",                                      destination: "/compass",                    permanent: false },
    ];
  },
};

export default nextConfig;
