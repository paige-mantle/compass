export function CompassHeader({
  variant = "light",
}: {
  variant?: "dark" | "light";
}) {
  const logoSrc =
    variant === "light"
      ? "/compass-logo-color-black.svg"
      : "/compass-logo-color-white.svg";

  return (
    <header className="site-header">
      <a className="site-brand" href="/compass" aria-label="Mantle Compass">
        <img className="site-logo" src={logoSrc} alt="Mantle Compass" />
      </a>
      <form className="site-search" role="search" action="#">
        <svg
          className="site-search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          className="site-search-input"
          type="search"
          placeholder="Search Compass"
          aria-label="Search Compass"
        />
      </form>
      <div className="site-actions">
        <a className="sign-in-link" href="/">
          Back to Mantle
        </a>
        <a className="site-cta" href="#">
          Start for free
        </a>
      </div>
    </header>
  );
}
