import "@/app/global.css";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { Navbar } from "@/components/geistdocs/navbar";
import { GeistdocsProvider } from "@/components/geistdocs/provider";
import { mono, sans } from "@/lib/geistdocs/fonts";

const Layout = ({ children }: LayoutProps<"/">) => (
  <html
    className={cn(sans.variable, mono.variable, "font-sans antialiased")}
    lang="en"
    suppressHydrationWarning
  >
    <body className="flex min-h-screen flex-col">
      <GeistdocsProvider basePath="/elements">
        <Navbar items={[]} suggestions={[]}>
          <span>Logo</span>
        </Navbar>
        {children}
      </GeistdocsProvider>
    </body>
  </html>
);

export default Layout;
