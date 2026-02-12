"use client";

import type { ComponentProps, MouseEvent, ReactNode } from "react";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { createContext, useCallback, useContext, useId, useMemo } from "react";

export type ChoiceSelection = string | string[] | undefined;

const normalizeSelection = (
  value: ChoiceSelection,
  multiple: boolean
): string[] => {
  if (value === undefined || value === null) {
    return [];
  }

  if (Array.isArray(value)) {
    if (multiple) {
      return value;
    }

    return value.length > 0 ? [value[0]] : [];
  }

  return value.length > 0 ? [value] : [];
};

const toExternalSelection = (
  values: string[],
  multiple: boolean
): ChoiceSelection => (multiple ? values : values[0]);

interface ChoiceContextValue {
  multiple: boolean;
  disabled: boolean;
  questionId: string;
  selectedValues: string[];
  canSubmit: boolean;
  toggleValue: (value: string) => void;
  submitSelection: () => void;
}

const ChoiceContext = createContext<ChoiceContextValue | null>(null);

const useChoiceContext = () => {
  const context = useContext(ChoiceContext);

  if (!context) {
    throw new Error("Choice components must be used within Choice");
  }

  return context;
};

export type ChoiceProps = ComponentProps<"div"> & {
  multiple?: boolean;
  disabled?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: ChoiceSelection) => void;
  onSubmit?: (value: string | string[]) => void;
  submitOnSelect?: boolean;
};

export const Choice = ({
  className,
  multiple = false,
  disabled = false,
  value,
  defaultValue,
  onValueChange,
  onSubmit,
  submitOnSelect = true,
  ...props
}: ChoiceProps) => {
  const questionId = useId();
  const controlledSelection =
    value === undefined ? undefined : normalizeSelection(value, multiple);

  const [selectedValues, setSelectedValues] = useControllableState<string[]>({
    defaultProp: normalizeSelection(defaultValue, multiple),
    onChange: (nextSelection) =>
      onValueChange?.(toExternalSelection(nextSelection, multiple)),
    prop: controlledSelection,
  });

  const submitSelection = useCallback(() => {
    if (disabled || !onSubmit || selectedValues.length === 0) {
      return;
    }

    const output = multiple ? selectedValues : selectedValues[0];
    if (output) {
      onSubmit(output);
    }
  }, [disabled, onSubmit, selectedValues, multiple]);

  const toggleValue = useCallback(
    (optionValue: string) => {
      if (disabled) {
        return;
      }

      if (multiple) {
        setSelectedValues((prev) =>
          prev.includes(optionValue)
            ? prev.filter((item) => item !== optionValue)
            : [...prev, optionValue]
        );
        return;
      }

      setSelectedValues([optionValue]);
      if (submitOnSelect && onSubmit) {
        onSubmit(optionValue);
      }
    },
    [disabled, multiple, onSubmit, setSelectedValues, submitOnSelect]
  );

  const canSubmit = selectedValues.length > 0 && !disabled;

  const contextValue = useMemo(
    () => ({
      canSubmit,
      disabled,
      multiple,
      questionId,
      selectedValues,
      submitSelection,
      toggleValue,
    }),
    [
      canSubmit,
      disabled,
      multiple,
      questionId,
      selectedValues,
      submitSelection,
      toggleValue,
    ]
  );

  return (
    <ChoiceContext.Provider value={contextValue}>
      <div className={cn("not-prose space-y-2", className)} {...props} />
    </ChoiceContext.Provider>
  );
};

export type ChoiceQuestionProps = ComponentProps<"p">;

export const ChoiceQuestion = ({
  className,
  ...props
}: ChoiceQuestionProps) => {
  const { questionId } = useChoiceContext();

  return (
    <p
      className={cn("font-medium text-foreground text-sm", className)}
      id={questionId}
      {...props}
    />
  );
};

export type ChoiceOptionsProps = ComponentProps<"div">;

export const ChoiceOptions = ({ className, ...props }: ChoiceOptionsProps) => {
  const { disabled, questionId } = useChoiceContext();

  return (
    <div
      aria-disabled={disabled}
      aria-labelledby={questionId}
      className={cn("flex flex-wrap gap-2", className)}
      role="group"
      {...props}
    />
  );
};

export type ChoiceOptionProps = Omit<ComponentProps<typeof Button>, "value"> & {
  value: string;
  description?: ReactNode;
  onSelect?: (value: string) => void;
};

export const ChoiceOption = ({
  value,
  description,
  onSelect,
  children,
  className,
  variant,
  size = "sm",
  disabled,
  onClick,
  ...props
}: ChoiceOptionProps) => {
  const descriptionId = useId();
  const {
    selectedValues,
    toggleValue,
    disabled: rootDisabled,
  } = useChoiceContext();

  const isSelected = selectedValues.includes(value);
  const resolvedVariant = variant ?? (isSelected ? "default" : "outline");

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (event.defaultPrevented || disabled || rootDisabled) {
        return;
      }

      toggleValue(value);
      onSelect?.(value);
    },
    [disabled, onClick, onSelect, rootDisabled, toggleValue, value]
  );

  return (
    <Button
      aria-describedby={description ? descriptionId : undefined}
      aria-pressed={isSelected}
      className={cn(
        "h-auto max-w-full justify-start rounded-full px-4 py-2 text-left whitespace-normal",
        className
      )}
      disabled={disabled || rootDisabled}
      size={size}
      type="button"
      variant={resolvedVariant}
      {...props}
      onClick={handleClick}
    >
      <span className="flex flex-col items-start gap-1">
        <span>{children ?? value}</span>
        {description ? (
          <span
            className="text-muted-foreground text-xs leading-snug"
            id={descriptionId}
          >
            {description}
          </span>
        ) : null}
      </span>
    </Button>
  );
};

export type ChoiceSubmitProps = ComponentProps<typeof Button> & {
  showCount?: boolean;
};

export const ChoiceSubmit = ({
  children,
  className,
  disabled,
  showCount = true,
  onClick,
  ...props
}: ChoiceSubmitProps) => {
  const {
    canSubmit,
    selectedValues,
    multiple,
    submitSelection,
    disabled: rootDisabled,
  } = useChoiceContext();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (event.defaultPrevented) {
        return;
      }

      submitSelection();
    },
    [onClick, submitSelection]
  );

  const label =
    children ??
    (multiple && showCount ? `Confirm (${selectedValues.length})` : "Confirm");

  return (
    <Button
      className={cn("h-8 px-3", className)}
      disabled={disabled || rootDisabled || !canSubmit}
      size="sm"
      type="button"
      {...props}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};

export type ChoiceStatusProps = ComponentProps<"p"> & {
  status?: "error" | "info";
};

export const ChoiceStatus = ({
  className,
  status = "info",
  ...props
}: ChoiceStatusProps) => (
  <p
    className={cn(
      "text-sm",
      status === "error" ? "text-destructive" : "text-muted-foreground",
      className
    )}
    role={status === "error" ? "alert" : "status"}
    {...props}
  />
);
