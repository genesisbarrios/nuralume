import { parseWebStream } from "music-metadata";
import { unstable_cache } from "next/cache";

async function extractAlbumArt(url: string): Promise<string | null> {
  const response = await fetch(url);
  if (!response.ok || !response.body) return null;

  try {
    const metadata = await parseWebStream(response.body, undefined, {
      duration: false,
      skipCovers: false,
    });
    const picture = metadata.common.picture?.[0];
    if (!picture) return null;

    return `data:${picture.format};base64,${Buffer.from(picture.data).toString("base64")}`;
  } catch {
    return null;
  } finally {
    await response.body.cancel().catch(() => {});
  }
}

// Embedded ID3 covers rarely change once a track is uploaded, so cache the
// extracted image per storage URL instead of re-downloading/parsing on every
// dashboard load.
export const getAlbumArt = unstable_cache(extractAlbumArt, ["track-album-art"], {
  revalidate: 60 * 60 * 24,
});
