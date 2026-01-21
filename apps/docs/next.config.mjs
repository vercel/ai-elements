import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },

  rewrites() {
    return [
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

export default withMDX(config);
