import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OGImage } from "./og-image-template";

export const alt = "Mantle Compass — practical manuals for early-stage founders";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <OGImage
        eyebrow="Mantle Compass"
        title="Practical manuals for early-stage founders"
        subtitle="Positioning. Real demand. Customer discovery."
      />
    ),
    size
  );
}
