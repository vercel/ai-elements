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
          This tool wants to execute a query on the production database:
          <code className="mt-2 block rounded bg-muted p-2 text-sm">
            SELECT * FROM users WHERE role = &apos;admin&apos;
          </code>
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
