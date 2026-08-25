import type { MetadataRoute } from "next";
import config from "@/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: config.appName,
    short_name: config.appName,
    description: config.appDescription,
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#FDFBF7",
    theme_color: config.colors.main,
    icons: [
      {
        src: "/nuralume-icon-square.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
