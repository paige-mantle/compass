/**
 * <mantle-newsletter> — single source of truth for the newsletter subscribe
 * form across every Mantle page. Update the markup or copy here and every
 * page that includes this script picks up the change automatically.
 *
 * Light-DOM custom element so existing per-page CSS (.compass-news-form,
 * .compass-news-input, etc.) continues to style it without a rewrite.
 */
(function () {
  if (window.customElements && customElements.get("mantle-newsletter")) return;

  class MantleNewsletter extends HTMLElement {
    connectedCallback() {
      if (this._rendered) return;
      this._rendered = true;
      this.innerHTML = [
        '<div class="compass-news-form">',
        '  <div class="compass-news-row">',
        '    <input class="compass-news-input" type="email" name="email" placeholder="Enter your email" aria-label="Email address" required />',
        '    <button class="compass-news-submit" type="submit">Submit</button>',
        '  </div>',
        '  <div class="compass-news-legal">We respect your privacy.</div>',
        "</div>",
      ].join("\n");
    }
  }

  customElements.define("mantle-newsletter", MantleNewsletter);
})();
