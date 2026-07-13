import { parseWebStream } from "music-metadata";
import { unstable_cache } from "next/cache";

async function extractAlbumArt(url: string): Promise<string | null> {
  // A hung or failing fetch here must never take the whole tracks list down
  // with it — wrap the entire thing (not just parsing) and cap how long a
  // slow/unresponsive storage request can block the page render.
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok || !response.body) return null;

    try {
      const metadata = await parseWebStream(response.body, undefined, {
        duration: false,
        skipCovers: false,
      });
      const picture = metadata.common.picture?.[0];
      if (!picture) return null;

      return `data:${picture.format};base64,${Buffer.from(picture.data).toString("base64")}`;
    } finally {
      await response.body.cancel().catch(() => {});
    }
  } catch (err) {
    console.error("[albumArt] falling back to no cover:", err);
    return null;
  }
}

// Embedded ID3 covers rarely change once a track is uploaded, so cache the
// extracted image per storage URL instead of re-downloading/parsing on every
// dashboard load.
export const getAlbumArt = unstable_cache(extractAlbumArt, ["track-album-art"], {
  revalidate: 60 * 60 * 24,
});
