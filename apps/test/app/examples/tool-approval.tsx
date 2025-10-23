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

const APPROVAL_STATES = [
  {
    approval: { id: nanoid() },
    state: "approval-requested" as const,
  },
  {
    approval: { id: nanoid(), approved: true },
    state: "approval-responded" as const,
  },
  {
    approval: {
      id: nanoid(),
      approved: false,
      reason: "User rejected the execution",
    },
    state: "output-denied" as const,
  },
];

const Example = () => {
  return (
    <div className="space-y-4">
      {APPROVAL_STATES.map(({ approval, state }) => (
        <ToolApproval approval={approval} key={approval.id} state={state}>
          <ToolApprovalContent>
            <ToolApprovalRequest>
              Are you sure you want to delete index.ts?
            </ToolApprovalRequest>
            <ToolApprovalAccepted>
              <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
              <span>
                Accepted
                {approval.reason && (
                  <span className="text-muted-foreground">
                    : {approval.reason}
                  </span>
                )}
              </span>
            </ToolApprovalAccepted>
            <ToolApprovalRejected>
              <XIcon className="size-4 text-destructive" />
              <span>
                Rejected
                {approval.reason && (
                  <span className="text-muted-foreground">
                    : {approval.reason}
                  </span>
                )}
              </span>
            </ToolApprovalRejected>
          </ToolApprovalContent>
          <ToolApprovalActions>
            <ToolApprovalAction
              onClick={() => {
                // Handle rejection
              }}
              variant="outline"
            >
              Reject
            </ToolApprovalAction>
            <ToolApprovalAction
              onClick={() => {
                // Handle approval
              }}
              variant="default"
            >
              Accept
            </ToolApprovalAction>
          </ToolApprovalActions>
        </ToolApproval>
      ))}
    </div>
  );
};

export default Example;
