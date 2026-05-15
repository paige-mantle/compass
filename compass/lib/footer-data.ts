/**
 * Footer link grid data — sourced from the live heymantle.com footer
 * (Mantle Core / Advanced / Pro / Resources / Legal).
 *
 * Static data, not fetched. In the Mantle next-gen Astro repo this
 * comes from `getSiteContent()` which pulls per-feature page metadata
 * dynamically. We hardcode here because Compass has no parallel
 * content store; updating Mantle's feature pages means manually
 * updating this list. Keep in sync with heymantle.com.
 *
 * External URLs use `external: true` so the renderer can add
 * `target="_blank"` + `rel="noopener noreferrer"`. Otherwise links
 * are path-relative; the renderer prefixes them with the marketing
 * origin (`https://heymantle.com`) so users navigate out of Compass.
 */
export type FooterLink = {
  title: string;
  href: string;
  external?: boolean;
};

export type FooterCategory = {
  title: string;
  links: FooterLink[];
};

export const FOOTER_CATEGORIES: FooterCategory[] = [
  {
    title: "Mantle Core",
    links: [
      { title: "Plans and billing", href: "/plans-and-subscriptions" },
      { title: "Reports and analytics", href: "/reports-and-analytics" },
      { title: "Customer management", href: "/customer-management" },
      { title: "AI-enhanced analytics", href: "/ai-assistant" },
      { title: "Hosted billing", href: "/hosted-billing" },
      { title: "Flex billing", href: "/flex-billing" },
    ],
  },
  {
    title: "Mantle Advanced",
    links: [
      { title: "Email marketing", href: "/email-marketing" },
      { title: "Flow automations", href: "/flow-automations" },
      { title: "Affiliate programs", href: "/affiliate-programs" },
      { title: "Intake forms", href: "/intake-forms" },
    ],
  },
  {
    title: "Mantle Pro",
    links: [
      { title: "Help desk + knowledge base", href: "/help-desk" },
      { title: "Sales + CRM", href: "/sales-crm" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Pricing", href: "/pricing" },
      { title: "Docs", href: "https://docs.heymantle.com/welcome-to-mantle", external: true },
      { title: "Blog", href: "/blog" },
      { title: "Developers", href: "/developers" },
      { title: "Components", href: "/components" },
      { title: "Changelog", href: "/changelog" },
      { title: "Customer stories", href: "/customers" },
      {
        title: "Shopify App Store Index",
        href: "https://sasi.heymantle.com?ref=mantle",
        external: true,
      },
      { title: "Experiences", href: "/experiences" },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Privacy policy", href: "/privacy" },
      { title: "Terms of service", href: "/tos" },
    ],
  },
];

/**
 * Origin to prefix path-relative links with. heymantle.com is the
 * marketing site; Compass nests under `/compass`, `/workflows`, etc.
 * but those four paths are content-only — the rest of the link grid
 * points back to marketing.
 *
 * In production both sites share `heymantle.com`, so technically
 * path-relative links would resolve correctly. We prefix explicitly
 * so the footer behaves identically in dev (where Compass runs on
 * `localhost:3001`) and any preview deployment that doesn't share
 * the marketing host.
 */
export const FOOTER_LINK_ORIGIN = "https://heymantle.com";

export function footerLinkHref(link: FooterLink): string {
  if (link.external) return link.href;
  if (link.href.startsWith("/blog") || link.href.startsWith("/compass")) {
    // /blog is the Insights index inside Compass — keep relative
    return link.href;
  }
  return `${FOOTER_LINK_ORIGIN}${link.href}`;
}
