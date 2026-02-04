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

const handleFilePathClick = (path: string, line: number, col: number) => {
  console.log(`Open file: ${path}:${line}:${col}`);
};

const handleCopy = () => {
  console.log("Stack trace copied");
};

const sampleStackTrace = `TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (/app/components/UserList.tsx:15:23)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:14985:18)
    at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:17811:13)
    at beginWork (node_modules/react-dom/cjs/react-dom.development.js:19049:16)
    at HTMLUnknownElement.callCallback (node_modules/react-dom/cjs/react-dom.development.js:3945:14)
    at Object.invokeGuardedCallbackDev (node_modules/react-dom/cjs/react-dom.development.js:3994:16)
    at invokeGuardedCallback (node_modules/react-dom/cjs/react-dom.development.js:4056:31)
    at beginWork$1 (node_modules/react-dom/cjs/react-dom.development.js:23964:7)
    at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:22776:12)
    at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:22707:5)`;

const Example = () => (
  <StackTrace
    defaultOpen
    onFilePathClick={handleFilePathClick}
    trace={sampleStackTrace}
  >
    <StackTraceHeader>
      <StackTraceError>
        <StackTraceErrorType />
        <StackTraceErrorMessage />
      </StackTraceError>
      <StackTraceActions>
        <StackTraceCopyButton onCopy={handleCopy} />
        <StackTraceExpandButton />
      </StackTraceActions>
    </StackTraceHeader>
    <StackTraceContent>
      <StackTraceFrames />
    </StackTraceContent>
  </StackTrace>
);

export default Example;
