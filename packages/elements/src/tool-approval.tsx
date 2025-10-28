"use client";

import { Alert, AlertDescription } from "@repo/shadcn-ui/components/ui/alert";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import { cn } from "@repo/shadcn-ui/lib/utils";
import type { ToolUIPart } from "ai";
import {
  type ComponentProps,
  createContext,
  memo,
  type ReactNode,
  useContext,
} from "react";

type ToolApprovalContextValue = {
  approval: ToolUIPart["approval"];
  state: ToolUIPart["state"];
};

const ToolApprovalContext = createContext<ToolApprovalContextValue | null>(
  null
);

const useToolApproval = () => {
  const context = useContext(ToolApprovalContext);
  if (!context) {
    throw new Error("ToolApproval components must be used within ToolApproval");
  }
  return context;
};

export type ToolApprovalProps = ComponentProps<typeof Alert> & {
  approval?: ToolUIPart["approval"];
  state: ToolUIPart["state"];
};

export const ToolApproval = memo(
  ({ className, approval, state, children, ...props }: ToolApprovalProps) => {
    if (
      !approval ||
      state === "input-streaming" ||
      state === "input-available"
    ) {
      return null;
    }

    return (
      <ToolApprovalContext.Provider value={{ approval, state }}>
        <Alert className={cn("flex flex-col gap-2", className)} {...props}>
          {children}
        </Alert>
      </ToolApprovalContext.Provider>
    );
  }
);

export type ToolApprovalContentProps = ComponentProps<typeof AlertDescription>;

export const ToolApprovalContent = memo(
  ({ className, children, ...props }: ToolApprovalContentProps) => (
    <AlertDescription
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </AlertDescription>
  )
);

export type ToolApprovalRequestProps = {
  children?: ReactNode;
};

export const ToolApprovalRequest = memo(
  ({ children }: ToolApprovalRequestProps) => {
    const { state } = useToolApproval();

    // Only show when approval is requested
    if (state !== "approval-requested") {
      return null;
    }

    return <>{children}</>;
  }
);

export type ToolApprovalAcceptedProps = {
  children?: ReactNode;
};

export const ToolApprovalAccepted = memo(
  ({ children }: ToolApprovalAcceptedProps) => {
    const { approval, state } = useToolApproval();

    // Only show when approved and in response states
    if (
      !approval?.approved ||
      (state !== "approval-responded" &&
        state !== "output-denied" &&
        state !== "output-available")
    ) {
      return null;
    }

    return <>{children}</>;
  }
);

export type ToolApprovalRejectedProps = {
  children?: ReactNode;
};

export const ToolApprovalRejected = memo(
  ({ children }: ToolApprovalRejectedProps) => {
    const { approval, state } = useToolApproval();

    // Only show when rejected and in response states
    if (
      approval?.approved !== false ||
      (state !== "approval-responded" &&
        state !== "output-denied" &&
        state !== "output-available")
    ) {
      return null;
    }

    return <>{children}</>;
  }
);

export type ToolApprovalActionsProps = ComponentProps<"div">;

export const ToolApprovalActions = memo(
  ({ className, children, ...props }: ToolApprovalActionsProps) => {
    const { state } = useToolApproval();

    // Only show when approval is requested
    if (state !== "approval-requested") {
      return null;
    }

    return (
      <div
        className={cn(
          "flex items-center justify-end gap-2 self-end",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export type ToolApprovalActionProps = ComponentProps<typeof Button>;

export const ToolApprovalAction = memo((props: ToolApprovalActionProps) => (
  <Button className="h-8 px-3 text-sm" type="button" {...props} />
));

ToolApproval.displayName = "ToolApproval";
ToolApprovalContent.displayName = "ToolApprovalContent";
ToolApprovalRequest.displayName = "ToolApprovalRequest";
ToolApprovalAccepted.displayName = "ToolApprovalAccepted";
ToolApprovalRejected.displayName = "ToolApprovalRejected";
ToolApprovalActions.displayName = "ToolApprovalActions";
ToolApprovalAction.displayName = "ToolApprovalAction";
