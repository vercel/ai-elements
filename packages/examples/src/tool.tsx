"use client";

import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@repo/elements/tool";
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from "@repo/elements/confirmation";
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
        <Confirmation approval={{ id: nanoid() }} state="approval-requested">
          <ConfirmationTitle>
            <ConfirmationRequest>
              This tool will execute a query on the production database.
            </ConfirmationRequest>
            <ConfirmationAccepted>
              <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
              <span>Accepted</span>
            </ConfirmationAccepted>
            <ConfirmationRejected>
              <XIcon className="size-4 text-destructive" />
              <span>Rejected</span>
            </ConfirmationRejected>
          </ConfirmationTitle>
          <ConfirmationActions>
            <ConfirmationAction
              onClick={() => {
                // In production, call addConfirmationResponse
              }}
              variant="outline"
            >
              Reject
            </ConfirmationAction>
            <ConfirmationAction
              onClick={() => {
                // In production, call addConfirmationResponse
              }}
              variant="default"
            >
              Accept
            </ConfirmationAction>
          </ConfirmationActions>
        </Confirmation>
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
        <Confirmation
          approval={{ id: nanoid(), approved: true }}
          state="approval-responded"
        >
          <ConfirmationTitle>
            <ConfirmationRequest>
              This tool will execute a query on the production database.
            </ConfirmationRequest>
            <ConfirmationAccepted>
              <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
              <span>Accepted</span>
            </ConfirmationAccepted>
            <ConfirmationRejected>
              <XIcon className="size-4 text-destructive" />
              <span>Rejected</span>
            </ConfirmationRejected>
          </ConfirmationTitle>
        </Confirmation>
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
        <Confirmation
          approval={{ id: nanoid(), approved: true }}
          state="output-available"
        >
          <ConfirmationTitle>
            <ConfirmationRequest>
              This tool will execute a query on the production database.
            </ConfirmationRequest>
            <ConfirmationAccepted>
              <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
              <span>Accepted</span>
            </ConfirmationAccepted>
            <ConfirmationRejected>
              <XIcon className="size-4 text-destructive" />
              <span>Rejected</span>
            </ConfirmationRejected>
          </ConfirmationTitle>
        </Confirmation>
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
        <Confirmation
          approval={{
            id: nanoid(),
            approved: false,
            reason: "Query could impact production performance",
          }}
          state="output-denied"
        >
          <ConfirmationTitle>
            <ConfirmationRequest>
              This tool will execute a query on the production database.
            </ConfirmationRequest>
            <ConfirmationAccepted>
              <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
              <span>Accepted</span>
            </ConfirmationAccepted>
            <ConfirmationRejected>
              <XIcon className="size-4 text-destructive" />
              <span>Rejected: Query could impact production performance</span>
            </ConfirmationRejected>
          </ConfirmationTitle>
        </Confirmation>
      </ToolContent>
    </Tool>
  </div>
);

export default Example;
