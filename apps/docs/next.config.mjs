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
        source: "/elements/:lang/:path*.mdx",
        destination: "/elements/:lang/llms.mdx/:path*",
      },
      {
        source: "/elements/:lang/:path*.md",
        destination: "/elements/:lang/llms.mdx/:path*",
      },
      {
        source: "/:lang/:path*.mdx",
        destination: "/:lang/llms.mdx/:path*",
      },
      {
        source: "/:lang/:path*.md",
        destination: "/:lang/llms.mdx/:path*",
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
