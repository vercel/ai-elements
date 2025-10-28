"use client";

import {
  ToolApproval,
  ToolApprovalAccepted,
  ToolApprovalContent,
  ToolApprovalRejected,
  ToolApprovalRequest,
} from "@repo/elements/tool-approval";
import { CheckIcon, XIcon } from "lucide-react";
import { nanoid } from "nanoid";

const Example = () => (
  <div className="w-full max-w-2xl">
    <ToolApproval
      approval={{ id: nanoid(), approved: false }}
      state="output-denied"
    >
      <ToolApprovalContent>
        <ToolApprovalRequest>
          This tool wants to delete the file{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            /tmp/example.txt
          </code>
          . Do you approve this action?
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
    </ToolApproval>
  </div>
);

export default Example;
