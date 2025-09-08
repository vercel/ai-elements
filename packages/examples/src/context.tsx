'use client';

import { Context } from '@repo/elements/context';

const Example = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <Context maxTokens={272_000} usedTokens={50_800} />
    </div>
  );
};

export default Example;
