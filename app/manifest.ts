import type { MetadataRoute } from "next";
import config from "@/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: config.appName,
    short_name: config.appName,
    description: config.appDescription,
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F1F5FB",
    theme_color: config.colors.main,
    icons: [
      {
        src: "/nuralume-icon.png",
        sizes: "192x192 512x512",
        type: "image/png",
      },
    ],
  };
}
