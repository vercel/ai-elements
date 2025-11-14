import { cn } from "@repo/shadcn-ui/lib/utils";
import type { CSSProperties } from "react";

export const Banner = () => (
  <div className="hidden tracking-[0.004em] md:sticky md:top-[57px] md:z-50 xl:block">
    <aside
      className={cn(
        "-translate-y-px z-30 flex min-h-[40px] items-center justify-center gap-x-2 border-y py-2 text-[14px] leading-5",
        "border-[oklch(91.58%_0.0473_245.11621922481282)]",
        "bg-[oklch(97.32%_0.0141_251.56)]",
        "text-[oklch(53.18%_0.2399_256.9900584162342)]",
        "dark:border-[oklch(34.1%_0.121_254.74)]",
        "dark:bg-[oklch(22.17%_0.069_259.89)]",
        "dark:text-[oklch(91.58%_0.0473_245.11621922481282)]"
      )}
    >
      <div className="flex w-full flex-col gap-2 px-6 md:flex-row md:items-center md:justify-center">
        <div className="flex items-center gap-2">
          <div aria-hidden="true" className="shrink-0">
            <svg
              height="16"
              strokeLinejoin="round"
              style={{ color: "currentColor" }}
              viewBox="0 0 16 16"
              width="16"
            >
              <title>AI SDK 6</title>
              <path
                d="M2.5 0.5V0H3.5V0.5C3.5 1.60457 4.39543 2.5 5.5 2.5H6V3V3.5H5.5C4.39543 3.5 3.5 4.39543 3.5 5.5V6H3H2.5V5.5C2.5 4.39543 1.60457 3.5 0.5 3.5H0V3V2.5H0.5C1.60457 2.5 2.5 1.60457 2.5 0.5Z"
                fill="currentColor"
              />
              <path
                d="M14.5 4.5V5H13.5V4.5C13.5 3.94772 13.0523 3.5 12.5 3.5H12V3V2.5H12.5C13.0523 2.5 13.5 2.05228 13.5 1.5V1H14H14.5V1.5C14.5 2.05228 14.9477 2.5 15.5 2.5H16V3V3.5H15.5C14.9477 3.5 14.5 3.94772 14.5 4.5Z"
                fill="currentColor"
              />
              <path
                d="M8.40706 4.92939L8.5 4H9.5L9.59294 4.92939C9.82973 7.29734 11.7027 9.17027 14.0706 9.40706L15 9.5V10.5L14.0706 10.5929C11.7027 10.8297 9.82973 12.7027 9.59294 15.0706L9.5 16H8.5L8.40706 15.0706C8.17027 12.7027 6.29734 10.8297 3.92939 10.5929L3 10.5V9.5L3.92939 9.40706C6.29734 9.17027 8.17027 7.29734 8.40706 4.92939Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <p>AI SDK 6 is in Beta.</p>
        </div>
        <div className="ml-6 md:ml-0">
          <a
            className={cn(
              "-my-px h-6 cursor-pointer rounded-xs border-none bg-transparent px-0 py-1 font-medium font-sans underline decoration-blue-400 underline-offset-[5px] outline-none hover:text-blue-900 hover:decoration-blue-500 focus-visible:shadow-focus-ring",
              "text-[oklch(26.67%_0.1099_254.34)]",
              "dark:text-white"
            )}
            href="/docs/introduction/announcing-ai-sdk-6-beta"
            rel="noopener"
            style={
              {
                textDecorationColor: "oklch(91.58% 0.0473 245.11621922481282)",
                "--tw-shadow":
                  "0 0 0 2px var(--ds-background-100), 0 0 0 4px var(--banner-focus-color) !important",
              } as CSSProperties
            }
            target="_blank"
          >
            Learn more
          </a>
        </div>
      </div>
    </aside>{" "}
  </div>
);
