"use client";

import {
  ToolApproval,
  ToolApprovalAccepted,
  ToolApprovalAction,
  ToolApprovalActions,
  ToolApprovalContent,
  ToolApprovalRejected,
  ToolApprovalRequest,
} from "@repo/elements/tool-approval";
import { CheckIcon, XIcon } from "lucide-react";
import { nanoid } from "nanoid";

const Example = () => (
  <div className="w-full max-w-2xl">
    <ToolApproval approval={{ id: nanoid() }} state="approval-requested">
      <ToolApprovalContent>
        <ToolApprovalRequest>
          This tool wants to execute a query on the production database:
          <code className="mt-2 block rounded bg-muted p-2 text-sm">
            SELECT * FROM users WHERE role = &apos;admin&apos;
          </code>
        </ToolApprovalRequest>
        <ToolApprovalAccepted>
          <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
          <span>You approved this tool execution</span>
        </ToolApprovalAccepted>
        <ToolApprovalRejected>
          <XIcon className="size-4 text-destructive" />
          <span>You rejected this tool execution</span>
        </ToolApprovalRejected>
      </ToolApprovalContent>
      <ToolApprovalActions>
        <ToolApprovalAction
          onClick={() => {
            // In production, call respondToToolApprovalRequest with approved: false
          }}
          variant="outline"
        >
          Reject
        </ToolApprovalAction>
        <ToolApprovalAction
          onClick={() => {
            // In production, call respondToToolApprovalRequest with approved: true
          }}
          variant="default"
        >
          Approve
        </ToolApprovalAction>
      </ToolApprovalActions>
    </ToolApproval>
  </div>
);

export default Example;
