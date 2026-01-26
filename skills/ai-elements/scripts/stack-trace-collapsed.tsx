"use client";

import {
  StackTrace,
  StackTraceActions,
  StackTraceContent,
  StackTraceCopyButton,
  StackTraceError,
  StackTraceErrorMessage,
  StackTraceErrorType,
  StackTraceExpandButton,
  StackTraceFrames,
  StackTraceHeader,
} from "@/components/ai-elements/stack-trace";

const errorString = `TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (/app/src/components/UserList.tsx:15:23)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:14985:18)
    at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:17811:13)`;

const Example = () => (
  <StackTrace defaultOpen={false} trace={errorString}>
    <StackTraceHeader>
      <StackTraceError>
        <StackTraceErrorType />
        <StackTraceErrorMessage />
      </StackTraceError>
      <StackTraceActions>
        <StackTraceCopyButton />
        <StackTraceExpandButton />
      </StackTraceActions>
    </StackTraceHeader>
    <StackTraceContent>
      <StackTraceFrames />
    </StackTraceContent>
  </StackTrace>
);

export default Example;
