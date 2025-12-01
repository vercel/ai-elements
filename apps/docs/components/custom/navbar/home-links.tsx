"use client";

import Link from "next/link";

const VercelIcon = ({ size = 18 }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <title>Vercel</title>
    <path
      clipRule="evenodd"
      d="M8 1L16 15H0L8 1Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

const SlashForwardIcon = ({ size = 16 }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <title>Slash Forward</title>
    <path
      clipRule="evenodd"
      d="M4.01526 15.3939L4.3107 14.7046L10.3107 0.704556L10.6061 0.0151978L11.9849 0.606077L11.6894 1.29544L5.68942 15.2954L5.39398 15.9848L4.01526 15.3939Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

const SparklesIcon = ({ size = 16 }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: "currentcolor" }}
    viewBox="0 0 16 16"
    width={size}
  >
    <title>Sparkles</title>
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
);

export const HomeLinks = () => (
  <span className="home-links flex flex-row items-center gap-2">
    <Link
      className="-translate-y-[.5px] pl-4 text-zinc-800 dark:text-zinc-100"
      href="https://vercel.com/"
      rel="noopener"
      target="_blank"
    >
      <VercelIcon />
    </Link>

    <div className="w-4 text-center text-lg text-zinc-300 dark:text-zinc-600">
      <SlashForwardIcon />
    </div>

    <div className="flex flex-row items-center gap-4">
      <a className="flex flex-row items-center gap-2" href="/">
        <div className="flex flex-row items-center gap-2">
          <div className="text-zinc-800 dark:text-zinc-100">
            <SparklesIcon />
          </div>
          <div className="font-bold text-lg text-zinc-800 dark:text-zinc-100">
            <span className="tracking-[0.35px]">AI</span>{" "}
            <span className="hidden min-[385px]:inline">SDK</span>
          </div>
        </div>
      </a>
    </div>

    <style jsx>{`
      .home-links {
        mask-image: linear-gradient(
          60deg,
          black 25%,
          rgba(0, 0, 0, 0.2) 50%,
          black 75%
        );
        mask-size: 400%;
        mask-position: 0%;
      }
      .home-links:hover {
        mask-position: 100%;
        transition: mask-position 1s ease, -webkit-mask-position 1s ease;
      }
    `}</style>
  </span>
);
