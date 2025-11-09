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

  // biome-ignore lint/suspicious/useAwait: "redirects is async"
  async redirects() {
    return [
      {
        source: "/elements/overview",
        destination: "/elements",
        permanent: true,
      },
      {
        source: "/overview",
        destination: "/",
        permanent: true,
      },
      {
        source: "/elements/components/chatbot",
        destination: "/elements/examples/chatbot",
        permanent: true,
      },
    ];
  },
};

export default withMDX(withMicrofrontends(config));
