import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Seaport Client Monitor",
        short_name: "Client Monitor",
        description:
            "A tool to monitor project hours usage for Seaport Consulting",
        start_url: "/",
        display: "standalone",
        background_color: "#fff",
        icons: [
            {
                src: "/favicon.png",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}
