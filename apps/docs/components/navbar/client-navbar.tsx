"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/shadcn-ui/components/ui/sheet";
import { LargeSearchToggle } from "fumadocs-ui/components/layout/search-toggle";
import { ExternalLinkIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { HomeLinks } from "./home-links";

type NavPageItem = {
  href: string;
  tooltip: string;
  name: string;
  external?: boolean;
  shortened?: string;
  render?: () => React.ReactNode;
};

const LogoGithub = () => (
  <svg
    height="16"
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width="16"
  >
    <title>GitHub</title>
    <g clipPath="url(#clip0_872_3147)">
      <path
        clipRule="evenodd"
        d="M8 0C3.58 0 0 3.57879 0 7.99729C0 11.5361 2.29 14.5251 5.47 15.5847C5.87 15.6547 6.02 15.4148 6.02 15.2049C6.02 15.0149 6.01 14.3851 6.01 13.7154C4 14.0852 3.48 13.2255 3.32 12.7757C3.23 12.5458 2.84 11.836 2.5 11.6461C2.22 11.4961 1.82 11.1262 2.49 11.1162C3.12 11.1062 3.57 11.696 3.72 11.936C4.44 13.1455 5.59 12.8057 6.05 12.5957C6.12 12.0759 6.33 11.726 6.56 11.5261C4.78 11.3262 2.92 10.6364 2.92 7.57743C2.92 6.70773 3.23 5.98797 3.74 5.42816C3.66 5.22823 3.38 4.40851 3.82 3.30888C3.82 3.30888 4.49 3.09895 6.02 4.1286C6.66 3.94866 7.34 3.85869 8.02 3.85869C8.7 3.85869 9.38 3.94866 10.02 4.1286C11.55 3.08895 12.22 3.30888 12.22 3.30888C12.66 4.40851 12.38 5.22823 12.3 5.42816C12.81 5.98797 13.12 6.69773 13.12 7.57743C13.12 10.6464 11.25 11.3262 9.47 11.5261C9.76 11.776 10.01 12.2558 10.01 13.0056C10.01 14.0752 10 14.9349 10 15.2049C10 15.4148 10.15 15.6647 10.55 15.5847C12.1381 15.0488 13.5182 14.0284 14.4958 12.6673C15.4735 11.3062 15.9996 9.67293 16 7.99729C16 3.57879 12.42 0 8 0Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="clip0_872_3147">
        <rect fill="white" height="16" width="16" />
      </clipPath>
    </defs>
  </svg>
);

export const ClientNavbar = ({ pages }: { pages: NavPageItem[] }) => (
  <div className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between bg-background/80 backdrop-blur-sm py-2.5">
    <div className="flex select-none flex-row items-center">
      <div className="flex shrink-0 flex-row items-center gap-2">
        <HomeLinks />
      </div>

      <div className="hidden flex-row items-center pl-6 lg:flex">
        <div className="flex flex-row items-center gap-4">
          {pages.map((page) => (
            <Button
              asChild
              className="p-0 font-normal text-muted-foreground hover:text-foreground hover:no-underline"
              key={page.href}
              variant="link"
            >
              {page.render ? (
                <page.render />
              ) : (
                <a
                  href={page.href}
                  target={page.external ? "_blank" : undefined}
                >
                  <span className="flex items-center gap-1">
                    {page.shortened ? (
                      <>
                        <span className="hidden xl:inline-block">
                          {page.tooltip}
                        </span>
                        <span className="inline-block xl:hidden">
                          {page.shortened}
                        </span>
                      </>
                    ) : (
                      <span>{page.tooltip}</span>
                    )}
                    {page.external && (
                      <ExternalLinkIcon aria-hidden="true" className="size-3" />
                    )}
                  </span>
                </a>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>

    <Sheet>
      <SheetTrigger asChild className="mr-4 lg:hidden">
        <Button size="icon-sm" variant="outline">
          <MenuIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Navigate to different pages.</SheetDescription>
        </SheetHeader>
        <div className="mt-8 flex flex-col items-start gap-2">
          {pages.map((page) => (
            <Button key={page.href} variant="ghost">
              <a href={page.href}>{page.tooltip}</a>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>

    <div className="hidden lg:flex">
      <div className="hidden flex-row items-center justify-end gap-2 px-6 md:px-4 lg:col-span-1 lg:col-start-2 xl:flex">
        <LargeSearchToggle />
        <Button aria-label="Feedback" asChild size="sm" variant="outline">
          <Link
            href="https://github.com/vercel/ai-elements/issues"
            target="_noblank"
          >
            Feedback
          </Link>
        </Button>
        <Button aria-label="GitHub" asChild size="icon-sm" variant="outline">
          <Link href="https://github.com/vercel/ai-elements" target="_noblank">
            <LogoGithub />
          </Link>
        </Button>
        <Button asChild className="bg-black text-white" size="sm">
          <a href="/">
            <svg
              aria-label="Vercel Logo"
              className="fill-black dark:fill-white"
              fill="none"
              height="12"
              viewBox="0 0 235 203"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Vercel Logo</title>
              <path
                d="M117.082 0L234.164 202.794H0L117.082 0Z"
                fill="currentColor"
              />
            </svg>
            Sign in with Vercel
          </a>
        </Button>
      </div>
    </div>
  </div>
);
