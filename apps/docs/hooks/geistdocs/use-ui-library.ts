import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type UILibrary = "radix" | "base";

export const uiLibraryAtom = atomWithStorage<UILibrary>(
  "geistdocs:ui-library",
  "base"
);

export const useUILibrary = () => {
  const [library, setLibrary] = useAtom(uiLibraryAtom);
  return { library, setLibrary };
};
