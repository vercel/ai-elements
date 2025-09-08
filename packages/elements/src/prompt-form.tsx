"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import type { FormEvent, HTMLAttributes } from "react";
import { useCallback, useMemo, useState } from "react";
import { usePromptAttachments } from "./prompt-input-attachments";

export type PromptFormPayload = {
  prompt: string;
  files: File[];
};

export type PromptFormStatus = "idle" | "submitting" | "error";

export type PromptFormProps = Omit<
  HTMLAttributes<HTMLFormElement>,
  "onSubmit" | "children"
> & {
  onSubmit: (
    payload: PromptFormPayload,
    event: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
  namePrompt?: string;
  nameAttachments?: string;
  resetOnSubmit?: boolean;
  children: (render: {
    formProps: { onSubmit: (e: FormEvent<HTMLFormElement>) => void };
    status: PromptFormStatus;
  }) => React.ReactNode;
};

export function PromptForm({
  onSubmit,
  namePrompt = "prompt",
  nameAttachments = "attachments",
  resetOnSubmit = false,
  children,
  className,
  ...rest
}: PromptFormProps) {
  const attachments = usePromptAttachments();
  const [status, setStatus] = useState<PromptFormStatus>("idle");

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const fd = new FormData(form);
      const prompt = String(fd.get(namePrompt) ?? "");
      // Prefer context files when provider is present; otherwise fall back to named field
      const filesFromCtx = attachments?.files ?? [];
      const filesFromForm = fd
        .getAll(nameAttachments)
        .filter((v): v is File => v instanceof File);
      const files =
        filesFromCtx.length > 0 ? filesFromCtx : (filesFromForm as File[]);

      setStatus("submitting");
      try {
        await onSubmit({ prompt, files }, e);
        if (resetOnSubmit) {
          attachments?.clear?.();
          // Reset uncontrolled inputs in the form
          e.currentTarget.reset();
        }
        setStatus("idle");
      } catch (err) {
        setStatus("error");
        throw err;
      }
    },
    [
      attachments?.files,
      namePrompt,
      nameAttachments,
      onSubmit,
      resetOnSubmit,
      attachments?.clear,
    ]
  );

  const render = useMemo(
    () => ({ formProps: { onSubmit: handleSubmit }, status }),
    [handleSubmit, status]
  );

  return (
    <form className={cn(className)} {...rest}>
      {children(render)}
    </form>
  );
}
