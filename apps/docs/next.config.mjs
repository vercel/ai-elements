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

  rewrites() {
    return [
      {
        source: "/elements/:path*.mdx",
        destination: "/elements/llms.mdx/:path*",
      },
      {
        source: "/elements/:path*.md",
        destination: "/elements/llms.mdx/:path*",
      },
      {
        source: "/:path*.mdx",
        destination: "/llms.mdx/:path*",
      },
      {
        source: "/:path*.md",
        destination: "/llms.mdx/:path*",
      },
    ];
  },

  redirects() {
    return [
      {
        source: "/overview",
        destination: "/",
        permanent: true,
      },
      {
        source: "/components",
        destination: "/components/chain-of-thought",
        permanent: true,
      },
      {
        source: "/components/chatbot",
        destination: "/examples/chatbot",
        permanent: true,
      },
    ];
  },
};

export default withMDX(withMicrofrontends(config));
