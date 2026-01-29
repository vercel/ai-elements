import { Button } from "@repo/shadcn-ui/components/ui/button";
import { Kbd } from "@repo/shadcn-ui/components/ui/kbd";
import { useSearchContext } from "fumadocs-ui/contexts/search";

export const CustomSearch = () => {
  const { setOpenSearch } = useSearchContext();
  return (
    <Button
      className="w-[153.86px] justify-between rounded-sm border-none pr-[7px] font-normal text-muted-foreground shadow-none ring-1 ring-border"
      onClick={() => setOpenSearch(true)}
      size="sm"
      variant="outline"
    >
      <span>Search...</span>
      <Kbd className="flex h-5 min-h-5 min-w-5 items-center gap-[2.2px] rounded-xs border-none bg-transparent px-1 py-0 font-normal font-sans text-muted-foreground text-xs ring-1 ring-border">
        <span>⌘</span>
        <span>K</span>
      </Kbd>
    </Button>
  );
};
