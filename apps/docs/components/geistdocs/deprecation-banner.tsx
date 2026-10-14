export const DeprecationBanner = () => (
  <div className="border-b bg-amber-100 px-4 py-2 text-center text-amber-950 text-sm dark:bg-amber-950 dark:text-amber-100">
    AI Elements is moving to shadcn/ui. This project will be deprecated at the
    end of November 2026.{" "}
    <a
      className="font-medium underline underline-offset-4"
      href="https://ui.shadcn.com/docs/ai-elements"
      rel="noopener"
      target="_blank"
    >
      Learn more
    </a>
  </div>
);
