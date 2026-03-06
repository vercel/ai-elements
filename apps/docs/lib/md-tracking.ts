import { siteId } from "@/geistdocs";

const PLATFORM_URL = "https://geistdocs.com/md-tracking";

interface TrackMdRequestParams {
  path: string;
  userAgent: string | null;
  referer: string | null;
  acceptHeader: string | null;
  /** How the markdown was requested: 'md-url' for direct .md URLs, 'header-negotiated' for Accept header */
  requestType?: "md-url" | "header-negotiated";
}

/**
 * Track a markdown page request via the geistdocs platform.
 * Fire-and-forget: errors are logged but don't affect the response.
 */
export const trackMdRequest = async ({
  path,
  userAgent,
  referer,
  acceptHeader,
  requestType,
}: TrackMdRequestParams): Promise<void> => {
  try {
    const response = await fetch(PLATFORM_URL, {
      body: JSON.stringify({
        acceptHeader,
        path,
        referer,
        requestType,
        siteId: siteId ?? "geistdocs-unknown",
        userAgent,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      console.error(
        "MD tracking failed:",
        response.status,
        await response.text()
      );
    }
  } catch (error) {
    console.error("MD tracking error:", error);
  }
};
