'use client';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@repo/shadcn-ui/components/ui/hover-card';
import { cn } from '@repo/shadcn-ui/lib/utils';
import type { ComponentProps } from 'react';

export type ContextProps = ComponentProps<'button'> & {
  /** Total context window size in tokens */
  maxTokens: number;
  /** Tokens used so far */
  usedTokens: number;
};

const THOUSAND = 1000;
const MILLION = 1_000_000;
const BILLION = 1_000_000_000;
const PERCENT_MAX = 100;

// Lucide CircleIcon geometry
const ICON_VIEWBOX = 24;
const ICON_CENTER = 12;
const ICON_RADIUS = 10;
const ICON_STROKE_WIDTH = 2;

const formatTokens = (tokens?: number) => {
  if (tokens === undefined) {
    return;
  }
  if (!Number.isFinite(tokens)) {
    return;
  }
  const abs = Math.abs(tokens);
  if (abs < THOUSAND) {
    return `${tokens}`;
  }
  if (abs < MILLION) {
    return `${(tokens / THOUSAND).toFixed(1)}K`;
  }
  if (abs < BILLION) {
    return `${(tokens / MILLION).toFixed(1)}M`;
  }
  return `${(tokens / BILLION).toFixed(1)}B`;
};

const formatPercent = (value: number) => {
  if (!Number.isFinite(value)) {
    return '0%';
  }
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded)
    ? `${Math.trunc(rounded)}%`
    : `${rounded.toFixed(1)}%`;
};

type ContextIconProps = {
  percent: number; // 0 - 100
};

const ContextIcon = ({ percent }: ContextIconProps) => {
  const radius = ICON_RADIUS;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percent / PERCENT_MAX);

  return (
    <svg
      aria-label={`${formatPercent(percent)} of model context used`}
      height="20"
      role="img"
      style={{ color: 'currentcolor' }}
      viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`}
      width="20"
    >
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.25"
        r={radius}
        stroke="currentColor"
        strokeWidth={ICON_STROKE_WIDTH}
      />
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.7"
        r={radius}
        stroke="currentColor"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeWidth={ICON_STROKE_WIDTH}
        transform={`rotate(-90 ${ICON_CENTER} ${ICON_CENTER})`}
      />
    </svg>
  );
};

export const Context = ({
  className,
  maxTokens,
  usedTokens,
  ...props
}: ContextProps) => {
  const safeMax = Math.max(0, Number.isFinite(maxTokens) ? maxTokens : 0);
  const safeUsed = Math.min(
    Math.max(0, Number.isFinite(usedTokens) ? usedTokens : 0),
    safeMax
  );
  const usedPercent =
    safeMax > 0
      ? Math.min(PERCENT_MAX, Math.max(0, (safeUsed / safeMax) * PERCENT_MAX))
      : 0;

  const displayPct = formatPercent(Math.round(usedPercent * 10) / 10);

  const used = formatTokens(safeUsed);
  const total = formatTokens(safeMax);
  return (
    <HoverCard closeDelay={100} openDelay={100}>
      <HoverCardTrigger asChild>
        <button
          className={cn(
            'inline-flex select-none items-center gap-2 rounded-md px-2.5 py-1 text-sm',
            'bg-background text-foreground',
            className
          )}
          type="button"
          {...props}
        >
          <span className="font-medium text-muted-foreground">
            {displayPct}
          </span>
          <ContextIcon percent={usedPercent} />
        </button>
      </HoverCardTrigger>
      <HoverCardContent align="center" className="w-fit p-2">
        <p className="text-center text-sm">
          {displayPct} • {used} / {total} context used
        </p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Context;
