import "../global.css";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { AiSdkNav } from "@/components/custom/navbar";
import { Footer } from "@/components/geistdocs/footer";
// import { Navbar } from "@/components/geistdocs/navbar";
import { GeistdocsProvider } from "@/components/geistdocs/provider";
import { basePath } from "@/geistdocs";
import { mono, sans } from "@/lib/geistdocs/fonts";

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
          {/* <Navbar /> */}
          <AiSdkNav />
          {children}
          <Footer />
        </GeistdocsProvider>
      </body>
    </html>
  );
};

export default Layout;
