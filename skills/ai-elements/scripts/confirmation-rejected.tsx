"use client";

import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from "@/components/ai-elements/confirmation";
import { CheckIcon, XIcon } from "lucide-react";
import { nanoid } from "nanoid";

const Example = () => (
  <div className="w-full max-w-2xl">
    <Confirmation
      approval={{ approved: false, id: nanoid() }}
      state="output-denied"
    >
      <ConfirmationTitle>
        <ConfirmationRequest>
          This tool wants to delete the file{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            /tmp/example.txt
          </code>
          . Do you approve this action?
        </ConfirmationRequest>
        <ConfirmationAccepted>
          <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
          <span>You approved this tool execution</span>
        </ConfirmationAccepted>
        <ConfirmationRejected>
          <XIcon className="size-4 text-destructive" />
          <span>You rejected this tool execution</span>
        </ConfirmationRejected>
      </ConfirmationTitle>
    </Confirmation>
  </div>
);

export default Example;
