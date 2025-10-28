"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/shadcn-ui/components/ui/select";

export function VersionSwitch() {
  const currentVersion = "v6";

  const handleVersionChange = (version: string) => {
    if (version === "v4") {
      window.location.href = "https://v4.ai-sdk.dev";
    } else if (version === "v5") {
      window.location.href = "https://v5.ai-sdk.dev";
    } else {
      window.location.href = "/";
    }
  };

  return (
    <Select onValueChange={handleVersionChange} value={currentVersion}>
      <SelectTrigger className="h-auto! gap-px rounded-sm px-1.5 py-[3px] font-semibold text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="v4">v4</SelectItem>
        <SelectItem value="v5">v5</SelectItem>
        <SelectItem value="v6">v6</SelectItem>
      </SelectContent>
    </Select>
  );
}
