"use client";

import {
  MicSelector,
  MicSelectorContent,
  MicSelectorEmpty,
  MicSelectorInput,
  MicSelectorItem,
  MicSelectorLabel,
  MicSelectorList,
  MicSelectorTrigger,
  MicSelectorValue,
} from "@/components/ai-elements/mic-selector";

const handleOpenChange = (open: boolean) => {
  console.log("MicSelector is open?", open);
};

const handleValueChange = (newValue: string) => {
  console.log("MicSelector value:", newValue);
};

const Example = () => (
  <div className="flex size-full flex-col items-center justify-center gap-4">
    <MicSelector
      onOpenChange={handleOpenChange}
      onValueChange={handleValueChange}
    >
      <MicSelectorTrigger className="w-full max-w-sm">
        <MicSelectorValue />
      </MicSelectorTrigger>
      <MicSelectorContent>
        <MicSelectorInput />
        <MicSelectorEmpty />
        <MicSelectorList>
          {(devices) =>
            devices.map((device) => (
              <MicSelectorItem key={device.deviceId} value={device.deviceId}>
                <MicSelectorLabel device={device} />
              </MicSelectorItem>
            ))
          }
        </MicSelectorList>
      </MicSelectorContent>
    </MicSelector>
  </div>
);

export default Example;
