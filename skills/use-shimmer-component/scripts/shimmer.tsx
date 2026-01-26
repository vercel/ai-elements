"use client";

import { Shimmer } from "@/components/ai-elements/shimmer";

const Example = () => (
  <div className="flex flex-col items-center justify-center gap-4 p-8">
    <Shimmer>This text has a shimmer effect</Shimmer>
    <Shimmer as="h1" className="font-bold text-4xl">
      Large Heading
    </Shimmer>
    <Shimmer duration={3} spread={3}>
      Slower shimmer with wider spread
    </Shimmer>
  </div>
);

export default Example;
