import type { MetadataRoute } from "next";
import { source } from "@/lib/geistdocs/source";

const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
const baseUrl = `${protocol}://${process.env.BASE_URL}`;

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string): string => new URL(path, baseUrl).toString();

  const pages = source.getPages().map((page) => ({
    url: url(page.url),
    lastModified: page.data.lastModified
      ? new Date(page.data.lastModified)
      : undefined,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    {
      url: url("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...pages,
  ];
}
