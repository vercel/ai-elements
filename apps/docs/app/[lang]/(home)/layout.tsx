import { HomeLayout } from "@/components/geistdocs/home-layout";
import { getCombinedPageTree } from "@/lib/geistdocs/source";

const Layout = async ({ children, params }: LayoutProps<"/[lang]">) => {
  const { lang } = await params;

  return (
    <HomeLayout tree={getCombinedPageTree(lang)}>
      <div className="-mb-px bg-sidebar pt-0 sm:mb-0 sm:pb-32">{children}</div>
    </HomeLayout>
  );
};

export default Layout;
