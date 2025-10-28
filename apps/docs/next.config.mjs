import { withMicrofrontends } from "@vercel/microfrontends/next/config";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  basePath: "/elements",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },

  // biome-ignore lint/suspicious/useAwait: "rewrites is async"
  async rewrites() {
    return [
      {
        source: "/:path*.mdx",
        destination: "/llms.mdx/:path*",
      },
    ];
  },

  // biome-ignore lint/suspicious/useAwait: "redirects is async"
  async redirects() {
    return [
      {
        source: "/elements/overview",
        destination: "/elements",
      },
      {
        source: "/overview",
        destination: "/",
      },
    ];
  },
};

export default withMDX(withMicrofrontends(config));
