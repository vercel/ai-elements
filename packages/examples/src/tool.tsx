"use client";

import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@repo/elements/tool";
import {
  ToolApproval,
  ToolApprovalAccepted,
  ToolApprovalAction,
  ToolApprovalActions,
  ToolApprovalContent,
  ToolApprovalRejected,
  ToolApprovalRequest,
} from "@repo/elements/tool-approval";
import type { ToolUIPart } from "ai";
import { CheckIcon, XIcon } from "lucide-react";
import { nanoid } from "nanoid";

const toolCall: ToolUIPart = {
  type: "tool-database_query" as const,
  toolCallId: nanoid(),
  state: "output-available" as const,
  input: {
    query: "SELECT COUNT(*) FROM users WHERE created_at >= ?",
    params: ["2024-01-01"],
    database: "analytics",
  },
  output: `| User ID | Name | Email | Created At |
|---------|------|-------|------------|
| 1 | John Doe | john@example.com | 2024-01-15 |
| 2 | Jane Smith | jane@example.com | 2024-01-20 |
| 3 | Bob Wilson | bob@example.com | 2024-02-01 |
| 4 | Alice Brown | alice@example.com | 2024-02-10 |
| 5 | Charlie Davis | charlie@example.com | 2024-02-15 |`,
  errorText: undefined,
};

const Example = () => (
  <div className="space-y-4" style={{ minHeight: "1400px" }}>
    {/* 1. input-streaming: Pending */}
    <Tool defaultOpen>
      <ToolHeader
        state="input-streaming"
        title="database_query"
        type="tool-database_query"
      />
      <ToolContent>
        <ToolInput input={{}} />
      </ToolContent>
    </Tool>

    {/* 2. approval-requested: Awaiting Approval */}
    <Tool>
      <ToolHeader
        state={"approval-requested" as ToolUIPart["state"]}
        title="database_query"
        type="tool-database_query"
      />
      <ToolContent>
        <ToolInput input={toolCall.input} />
        <ToolApproval approval={{ id: nanoid() }} state="approval-requested">
          <ToolApprovalContent>
            <ToolApprovalRequest>
              This tool will execute a query on the production database.
            </ToolApprovalRequest>
            <ToolApprovalAccepted>
              <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
              <span>Accepted</span>
            </ToolApprovalAccepted>
            <ToolApprovalRejected>
              <XIcon className="size-4 text-destructive" />
              <span>Rejected</span>
            </ToolApprovalRejected>
          </ToolApprovalContent>
          <ToolApprovalActions>
            <ToolApprovalAction
              onClick={() => {
                // In production, call addToolApprovalResponse
              }}
              variant="outline"
            >
              Reject
            </ToolApprovalAction>
            <ToolApprovalAction
              onClick={() => {
                // In production, call addToolApprovalResponse
              }}
              variant="default"
            >
              Accept
            </ToolApprovalAction>
          </ToolApprovalActions>
        </ToolApproval>
      </ToolContent>
    </Tool>

    {/* 3. approval-responded: Responded */}
    <Tool>
      <ToolHeader
        state={"approval-responded" as ToolUIPart["state"]}
        title="database_query"
        type="tool-database_query"
      />
      <ToolContent>
        <ToolInput input={toolCall.input} />
        <ToolApproval
          approval={{ id: nanoid(), approved: true }}
          state="approval-responded"
        >
          <ToolApprovalContent>
            <ToolApprovalRequest>
              This tool will execute a query on the production database.
            </ToolApprovalRequest>
            <ToolApprovalAccepted>
              <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
              <span>Accepted</span>
            </ToolApprovalAccepted>
            <ToolApprovalRejected>
              <XIcon className="size-4 text-destructive" />
              <span>Rejected</span>
            </ToolApprovalRejected>
          </ToolApprovalContent>
        </ToolApproval>
      </ToolContent>
    </Tool>

    {/* 4. input-available: Running */}
    <Tool>
      <ToolHeader
        state="input-available"
        title="database_query"
        type="tool-database_query"
      />
      <ToolContent>
        <ToolInput input={toolCall.input} />
      </ToolContent>
    </Tool>

    {/* 5. output-available: Completed */}
    <Tool>
      <ToolHeader state={toolCall.state} type={toolCall.type} />
      <ToolContent>
        <ToolInput input={toolCall.input} />
        <ToolApproval
          approval={{ id: nanoid(), approved: true }}
          state="output-available"
        >
          <ToolApprovalContent>
            <ToolApprovalRequest>
              This tool will execute a query on the production database.
            </ToolApprovalRequest>
            <ToolApprovalAccepted>
              <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
              <span>Accepted</span>
            </ToolApprovalAccepted>
            <ToolApprovalRejected>
              <XIcon className="size-4 text-destructive" />
              <span>Rejected</span>
            </ToolApprovalRejected>
          </ToolApprovalContent>
        </ToolApproval>
        {toolCall.state === "output-available" && (
          <ToolOutput errorText={toolCall.errorText} output={toolCall.output} />
        )}
      </ToolContent>
    </Tool>

    {/* 6. output-error: Error */}
    <Tool>
      <ToolHeader
        state="output-error"
        title="database_query"
        type="tool-database_query"
      />
      <ToolContent>
        <ToolInput input={toolCall.input} />
        <ToolOutput
          errorText="Connection timeout: Unable to reach database server"
          output={undefined}
        />
      </ToolContent>
    </Tool>

    {/* 7. output-denied: Denied */}
    <Tool>
      <ToolHeader
        state={"output-denied" as ToolUIPart["state"]}
        title="database_query"
        type="tool-database_query"
      />
      <ToolContent>
        <ToolInput input={toolCall.input} />
        <ToolApproval
          approval={{
            id: nanoid(),
            approved: false,
            reason: "Query could impact production performance",
          }}
          state="output-denied"
        >
          <ToolApprovalContent>
            <ToolApprovalRequest>
              This tool will execute a query on the production database.
            </ToolApprovalRequest>
            <ToolApprovalAccepted>
              <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
              <span>Accepted</span>
            </ToolApprovalAccepted>
            <ToolApprovalRejected>
              <XIcon className="size-4 text-destructive" />
              <span>
                Rejected
                <span className="text-muted-foreground">
                  : Query could impact production performance
                </span>
              </span>
            </ToolApprovalRejected>
          </ToolApprovalContent>
        </ToolApproval>
      </ToolContent>
    </Tool>
  </div>
);

export default Example;
