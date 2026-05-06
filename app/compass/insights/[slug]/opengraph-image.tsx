import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OGImage } from "@/app/og-image-template";
import { loadInsight } from "@/compass/lib/insights/content";

export const alt = "Mantle Compass insight";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Params = { slug: string };

export default async function InsightOG({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const loaded = await loadInsight(slug);
  if (!loaded) {
    return new ImageResponse(
      (
        <OGImage
          eyebrow="Mantle Compass"
          title="Insight"
          subtitle="Practical guidance for early-stage founders."
        />
      ),
      size
    );
  }
  return new ImageResponse(
    (
      <OGImage
        eyebrow={loaded.meta.ribbon ?? "Mantle Compass"}
        title={loaded.meta.title}
        subtitle={loaded.meta.summary}
      />
    ),
    size
  );
}
