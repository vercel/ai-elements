import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <DocsLayout
      githubUrl="https://github.com/vercel/components.build"
      links={[]}
      nav={{
        title: (
          <>
            <svg
              fill="none"
              height={20}
              viewBox="0 0 76 65"
              width={24}
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Vercel</title>
              <path
                d="M37.5274 0L75.0548 65H0L37.5274 0Z"
                fill="currentColor"
              />
            </svg>
            <span className="font-normal text-muted-foreground/50">/</span>
            <span className="font-medium">AI Elements</span>
          </>
        ),
      }}
      sidebar={{
        collapsible: false,
        tabs: [],
        className: "bg-background!",
      }}
      tree={source.pageTree}
    >
      {children}
    </DocsLayout>
  );
}
