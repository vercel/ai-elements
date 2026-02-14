import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        hostname: "github.com",
        protocol: "https",
      },
      {
        hostname: "placehold.co",
        protocol: "https",
      },
    ],
  },

  redirects() {
    return [
      {
        destination: "/",
        permanent: true,
        source: "/overview",
      },
      {
        destination: "/examples/chatbot",
        permanent: true,
        source: "/examples",
      },
      {
        destination: "/components/attachments",
        permanent: true,
        source: "/components",
      },
      {
        destination: "/examples/chatbot",
        permanent: true,
        source: "/components/chatbot",
      },
      {
        destination: "https://ui.shadcn.com/docs/components/radix/spinner",
        permanent: true,
        source: "/components/loader",
      },
    ];
  },
};

export default withMDX(config);
