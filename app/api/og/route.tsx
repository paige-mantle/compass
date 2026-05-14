import { ImageResponse } from "next/og";
import { OG_SIZE, OGImage } from "@/app/og-image-template";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eyebrow = searchParams.get("eyebrow") ?? "Mantle Compass";
  const title =
    searchParams.get("title") ?? "Practical manuals for early-stage founders";
  const subtitle =
    searchParams.get("subtitle") ??
    "Positioning. Real demand. Customer discovery.";
  return new ImageResponse(
    <OGImage eyebrow={eyebrow} title={title} subtitle={subtitle} />,
    {
      ...OG_SIZE,
      headers: {
        "cache-control": "public, max-age=3600, s-maxage=86400, immutable",
      },
    }
  );
}
