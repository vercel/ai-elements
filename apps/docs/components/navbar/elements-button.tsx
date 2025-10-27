import { cn } from "@repo/shadcn-ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const ElementsButton = () => {
  const [shouldPlayInitialAnimation, setShouldPlayInitialAnimation] =
    useState(false);
  const isCurrentPage = usePathname().includes("/elements");

  useEffect(() => {
    const hasPlayedAnimation = localStorage.getItem(
      "studio-ai-elements-anim-played"
    );
    if (!hasPlayedAnimation) {
      setShouldPlayInitialAnimation(true);
      localStorage.setItem("studio-ai-elements-anim-played", "true");
    }
  }, []);

  return (
    <Link
      className="group/elements relative flex size-full h-full items-center justify-center whitespace-nowrap rounded-full text-sm"
      href="/elements"
    >
      <div className="relative flex items-center justify-center gap-1.5 rounded-full">
        <span
          className={cn(
            "relative z-10 transition-colors duration-300",
            isCurrentPage
              ? "text-zinc-800 dark:text-zinc-100"
              : "text-zinc-500 dark:text-zinc-400"
          )}
        >
          AI Elements
          <span
            className={cn(
              "absolute inset-0 bg-zinc-800 bg-clip-text text-transparent opacity-0 transition-opacity duration-200 group-hover/elements:animate-shimmer-once group-hover/elements:opacity-100 dark:bg-zinc-100",
              shouldPlayInitialAnimation && "opacity-100"
            )}
            onAnimationEnd={() => {
              setShouldPlayInitialAnimation(false);
            }}
            style={{
              backgroundImage:
                "linear-gradient(90deg, transparent calc(50% - 40px), #12A594, #E93D82, #FFB224, transparent calc(50% + 40px))",
              backgroundSize: "200% 100%",
              backgroundPosition: "-50% center",
              ...(shouldPlayInitialAnimation && {
                animation: "shimmer 0.5s ease-in-out forwards",
              }),
            }}
          >
            AI Elements
            {/* Left sparkle */}
            <span className="text-zinc-800 dark:text-zinc-100">
              <svg
                className={cn(
                  "absolute top-[2px] right-0 scale-0 opacity-0 transition-all duration-300 ease-out group-hover/elements:scale-100 group-hover/elements:opacity-100",
                  shouldPlayInitialAnimation && "scale-100 opacity-100"
                )}
                height="3"
                viewBox="0 0 4 4"
                width="3"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 0.5C2.5 1.05228 2.94772 1.5 3.5 1.5H4V2.5H3.5C2.94772 2.5 2.5 2.94772 2.5 3.5V4H1.5V3.5C1.5 2.94772 1.05228 2.5 0.5 2.5H0V1.5H0.5C1.05228 1.5 1.5 1.05228 1.5 0.5V0H2.5V0.5Z"
                  fill="currentColor"
                />
              </svg>

              {/* Right sparkle */}
              <svg
                className={cn(
                  "absolute top-[6px] right-[-5px] scale-0 opacity-0 transition-all delay-75 duration-300 ease-out group-hover/elements:scale-100 group-hover/elements:opacity-100",
                  shouldPlayInitialAnimation && "scale-100 opacity-100"
                )}
                height="4"
                viewBox="0 0 4 4"
                width="4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 0.5C2.5 1.05228 2.94772 1.5 3.5 1.5H4V2.5H3.5C2.94772 2.5 2.5 2.94772 2.5 3.5V4H1.5V3.5C1.5 2.94772 1.05228 2.5 0.5 2.5H0V1.5H0.5C1.05228 1.5 1.5 1.05228 1.5 0.5V0H2.5V0.5Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </span>
        </span>
      </div>
    </Link>
  );
};
