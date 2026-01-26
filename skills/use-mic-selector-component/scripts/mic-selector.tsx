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

const Example = () => (
  <div className="flex size-full flex-col items-center justify-center gap-4">
    <MicSelector
      onOpenChange={(open) => console.log("MicSelector is open?", open)}
      onValueChange={(newValue) => console.log("MicSelector value:", newValue)}
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
