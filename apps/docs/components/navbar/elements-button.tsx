import Link from "next/link";

export const ElementsButton = () => (
  <Link
    className="group/elements relative flex size-full h-full items-center justify-center whitespace-nowrap rounded-full text-sm"
    href="/"
  >
    <div className="relative flex items-center justify-center gap-1.5 rounded-full">
      <span className="relative z-10 text-foreground transition-colors duration-300">
        AI Elements
        <span
          className="absolute inset-0 bg-clip-text text-transparent transition-opacity duration-200"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent calc(50% - 40px), #12A594, #E93D82, #FFB224, transparent calc(50% + 40px))",
            backgroundSize: "200% 100%",
            backgroundPosition: "-50% center",
          }}
        >
          AI Elements
          {/* Left sparkle */}
          <span className="text-zinc-800 dark:text-zinc-100">
            <svg
              className="absolute top-[2px] right-0 transition-all duration-300 ease-out"
              height="3"
              viewBox="0 0 4 4"
              width="3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Left sparkle</title>
              <path
                d="M2.5 0.5C2.5 1.05228 2.94772 1.5 3.5 1.5H4V2.5H3.5C2.94772 2.5 2.5 2.94772 2.5 3.5V4H1.5V3.5C1.5 2.94772 1.05228 2.5 0.5 2.5H0V1.5H0.5C1.05228 1.5 1.5 1.05228 1.5 0.5V0H2.5V0.5Z"
                fill="currentColor"
              />
            </svg>

            {/* Right sparkle */}
            <svg
              className="absolute top-[6px] right-[-5px] transition-all delay-75 duration-300 ease-out"
              height="4"
              viewBox="0 0 4 4"
              width="4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Right sparkle</title>
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
