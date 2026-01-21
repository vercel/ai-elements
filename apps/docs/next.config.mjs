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
    ],
  },

  rewrites() {
    return [
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/:path*",
      },
      {
        source: "/docs/:path*.md",
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

export default withMDX(config);
