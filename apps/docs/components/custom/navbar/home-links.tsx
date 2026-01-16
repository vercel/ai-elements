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
      <a
        className="flex flex-row items-center text-zinc-800 dark:text-zinc-100"
        href="/"
      >
        <svg
          fill="none"
          height="16"
          viewBox="0 0 311 90"
          width="55.28888888888889"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>AI SDK</title>
          <path
            d="M2.97269 86L32.6687 3.64H51.1127L80.8087 86H65.0327L58.1887 66.512H25.5927L18.7487 86H2.97269ZM30.0007 53.636H53.7807L41.9487 18.836L30.0007 53.636ZM130.894 3.64V16.748H117.67V72.892H131.59V86H88.5544V72.892H102.59V16.748H89.2504V3.64H130.894Z"
            fill="currentColor"
          />
          <rect
            height="75"
            rx="37.5"
            stroke="currentColor"
            strokeWidth="8"
            width="154"
            x="153"
            y="7.5"
          />
          <path
            d="M183.603 51.8472C184.393 56.468 187.677 59.508 193.088 59.508C197.222 59.508 200.019 57.8664 199.958 54.7048C199.897 51.5432 197.222 49.7192 190.473 48.0776C181.11 45.828 175.091 42.0584 175.091 35.1272C175.091 27.284 181.657 22.3592 191.507 22.3592C201.113 22.3592 207.68 28.2568 208.713 36.9512L199.472 37.4376C198.985 32.8776 195.824 30.02 191.264 30.02C187.251 30.02 184.393 32.0872 184.576 35.2488C184.697 38.8968 188.953 40.1128 193.574 41.268C203.241 43.396 209.382 47.5304 209.382 54.4008C209.382 62.6088 202.147 67.2296 192.845 67.2296C182.326 67.2296 174.909 61.3928 174.301 52.2728L183.603 51.8472ZM226.773 23.332C240.757 23.332 248.601 31.1144 248.601 44.9768C248.601 58.7784 240.879 66.5 227.138 66.5H211.877V23.332H226.773ZM221.119 58.7176H226.773C235.164 58.7176 239.177 54.2792 239.177 44.916C239.177 35.5528 235.164 31.1144 226.773 31.1144H221.119V58.7176ZM250.431 23.332H259.672V42.18L275.359 23.332H286.12L270.252 42.3624L287.093 66.5H276.575L264.172 48.564L259.672 53.7928V66.5H250.431V23.332Z"
            fill="currentColor"
          />
        </svg>
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
