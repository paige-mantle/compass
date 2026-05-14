import type { ReactElement } from "react";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function OGImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: "#0b0b0c",
        color: "#f5f5f4",
        fontFamily: "Geist, ui-sans-serif, system-ui",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            background: "#f5f5f4",
          }}
        />
        <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.3 }}>
          Mantle
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {eyebrow ? (
          <div
            style={{
              fontSize: 26,
              color: "#a8a29e",
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            fontSize: 84,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: -1.5,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              fontSize: 30,
              color: "#a8a29e",
              lineHeight: 1.35,
              maxWidth: 980,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 22,
          color: "#a8a29e",
        }}
      >
        <div>mantle-chi.vercel.app</div>
        <div>Mantle Compass</div>
      </div>
    </div>
  );
}
