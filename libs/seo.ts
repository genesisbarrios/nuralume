import config from "@/config";

// Next.js's metadata resolution REPLACES (rather than deep-merges) an
// object-valued field like `openGraph` or `twitter` whenever a page defines
// its own — so any page that sets its own openGraph/twitter without an
// `images` entry silently drops the root layout's image, even though the
// title/description look fine. Every page-level export needs its own
// reference to this so link previews (Facebook, Instagram, etc.) always
// find an image instead of falling back to whatever <img> happens to be
// first in the rendered page (usually the transparent header logo).
export const defaultOgImage = {
  url: "/nuralume-logo.png",
  width: 603,
  height: 722,
  alt: config.appName,
};
