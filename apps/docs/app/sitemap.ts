import type { MetadataRoute } from "next";
import {
  componentsSource,
  docsSource,
  examplesSource,
} from "@/lib/geistdocs/source";

const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
const baseUrl = `${protocol}://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string): string => new URL(path, baseUrl).toString();

  const pages: MetadataRoute.Sitemap = [];

  for (const page of docsSource.getPages()) {
    pages.push({
      url: url(page.url),
      lastModified: undefined,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    });
  }

  for (const page of componentsSource.getPages()) {
    pages.push({
      url: url(page.url),
      lastModified: undefined,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    });
  }

  for (const page of examplesSource.getPages()) {
    pages.push({
      url: url(page.url),
      lastModified: undefined,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    });
  }

  return [
    {
      url: url("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...pages,
  ];
}
