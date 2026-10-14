import "../global.css";
import { cn } from "@repo/shadcn-ui/lib/utils";

import { DeprecationBanner } from "@/components/geistdocs/deprecation-banner";
import { Footer } from "@/components/geistdocs/footer";
import { Navbar } from "@/components/geistdocs/navbar";
import { GeistdocsProvider } from "@/components/geistdocs/provider";
import { basePath } from "@/geistdocs";
import { mono, sans } from "@/lib/geistdocs/fonts";

import "katex/dist/katex.min.css";

const Layout = async ({ children, params }: LayoutProps<"/[lang]">) => {
  const { lang } = await params;

  return (
    <html
      className={cn(sans.variable, mono.variable, "scroll-smooth antialiased")}
      lang={lang}
      suppressHydrationWarning
    >
      <body>
        <GeistdocsProvider basePath={basePath} lang={lang}>
          <DeprecationBanner />
          <Navbar />
          {children}
          <Footer />
        </GeistdocsProvider>
      </body>
    </html>
  );
};

export default Layout;
