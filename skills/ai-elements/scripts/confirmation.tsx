"use client";

import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from "@/components/ai-elements/confirmation";
import { CheckIcon, XIcon } from "lucide-react";
import { nanoid } from "nanoid";

const handleReject = () => {
  // In production, call respondToConfirmationRequest with approved: false
};

const handleApprove = () => {
  // In production, call respondToConfirmationRequest with approved: true
};

const Example = () => (
  <div className="w-full max-w-2xl">
    <Confirmation approval={{ id: nanoid() }} state="approval-requested">
      <ConfirmationTitle>
        <ConfirmationRequest>
          This tool wants to delete the file{" "}
          <code className="inline rounded bg-muted px-1.5 py-0.5 text-sm">
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
      <ConfirmationActions>
        <ConfirmationAction onClick={handleReject} variant="outline">
          Reject
        </ConfirmationAction>
        <ConfirmationAction onClick={handleApprove} variant="default">
          Approve
        </ConfirmationAction>
      </ConfirmationActions>
    </Confirmation>
  </div>
);

export default Example;
