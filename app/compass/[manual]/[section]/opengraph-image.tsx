import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OGImage } from "@/app/og-image-template";
import { loadSection } from "@/compass/lib/manuals/content";

export const alt = "Mantle Compass manual section";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Params = { manual: string; section: string };

export default async function ManualSectionOG({
  params,
}: {
  params: Promise<Params>;
}) {
  const { manual, section } = await params;
  const loaded = await loadSection(manual, section);
  if (!loaded) {
    return new ImageResponse(
      (
        <OGImage
          eyebrow="Mantle Compass"
          title="Manual"
          subtitle="Practical guides for early-stage founders."
        />
      ),
      size
    );
  }
  const fm = loaded.frontmatter as { summary?: string };
  return new ImageResponse(
    (
      <OGImage
        eyebrow={loaded.manifest.title}
        title={loaded.section.title}
        subtitle={fm.summary}
      />
    ),
    size
  );
}
