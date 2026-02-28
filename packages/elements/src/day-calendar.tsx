"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { CalendarIcon } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import type { HTMLAttributes } from "react";

export interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
  description?: string;
}

interface DayCalendarContextValue {
  date: Date;
  events: CalendarEvent[];
  startHour: number;
  endHour: number;
}

const DayCalendarContext = createContext<DayCalendarContextValue | null>(null);

const useDayCalendar = () => {
  const context = useContext(DayCalendarContext);
  if (!context) {
    throw new Error("DayCalendar components must be used within DayCalendar");
  }
  return context;
};

const computeTimeWindow = (
  events: CalendarEvent[],
  startHourOverride?: number,
  endHourOverride?: number
): { startHour: number; endHour: number } => {
  if (startHourOverride !== undefined && endHourOverride !== undefined) {
    return { endHour: endHourOverride, startHour: startHourOverride };
  }

  if (events.length === 0) {
    return {
      endHour: endHourOverride ?? 17,
      startHour: startHourOverride ?? 9,
    };
  }

  const minStart = Math.min(
    ...events.map((e) => e.start.getHours() + e.start.getMinutes() / 60)
  );
  const maxEnd = Math.max(
    ...events.map((e) => e.end.getHours() + e.end.getMinutes() / 60)
  );

  const startHour = startHourOverride ?? Math.max(0, Math.floor(minStart - 2));
  const endHour = endHourOverride ?? Math.min(24, Math.ceil(maxEnd + 2));

  return { endHour, startHour };
};

export type DayCalendarProps = HTMLAttributes<HTMLDivElement> & {
  date: Date;
  events: CalendarEvent[];
  startHour?: number;
  endHour?: number;
};

export const DayCalendar = ({
  date,
  events,
  startHour: startHourProp,
  endHour: endHourProp,
  className,
  children,
  ...props
}: DayCalendarProps) => {
  const { startHour, endHour } = computeTimeWindow(
    events,
    startHourProp,
    endHourProp
  );

  const contextValue = useMemo<DayCalendarContextValue>(
    () => ({ date, endHour, events, startHour }),
    [date, endHour, events, startHour]
  );

  return (
    <DayCalendarContext.Provider value={contextValue}>
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-lg border border-border bg-background text-foreground",
          className
        )}
        data-slot="day-calendar"
        {...props}
      >
        {children}
      </div>
    </DayCalendarContext.Provider>
  );
};

export type DayCalendarHeaderProps = HTMLAttributes<HTMLDivElement>;

export const DayCalendarHeader = ({
  className,
  children,
  ...props
}: DayCalendarHeaderProps) => {
  const { date } = useDayCalendar();

  const formatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
  }).format(date);

  return (
    <div
      className={cn(
        "flex items-center gap-2 border-b border-border px-4 py-3 font-medium text-sm",
        className
      )}
      data-slot="day-calendar-header"
      {...props}
    >
      <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
      {children ?? <span>{formatted}</span>}
    </div>
  );
};

export type DayCalendarEventProps = HTMLAttributes<HTMLDivElement> & {
  event: CalendarEvent;
  startHour: number;
  totalHours: number;
};

export const DayCalendarEvent = ({
  event,
  startHour,
  totalHours,
  className,
  ...props
}: DayCalendarEventProps) => {
  const eventStartHour = event.start.getHours() + event.start.getMinutes() / 60;
  const eventEndHour = event.end.getHours() + event.end.getMinutes() / 60;

  const topPercent = ((eventStartHour - startHour) / totalHours) * 100;
  const heightPercent = ((eventEndHour - eventStartHour) / totalHours) * 100;

  const startFormatted = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(event.start);

  const endFormatted = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(event.end);

  return (
    <div
      className={cn(
        "absolute right-2 left-16 overflow-hidden rounded-md border-l-2 border-primary bg-primary/10 px-2 py-1 text-xs",
        className
      )}
      data-slot="day-calendar-event"
      style={{
        height: `${heightPercent}%`,
        top: `${topPercent}%`,
      }}
      {...props}
    >
      <p className="truncate font-medium text-foreground">{event.title}</p>
      <p className="text-muted-foreground">
        {startFormatted} – {endFormatted}
      </p>
      {event.description && (
        <p className="mt-0.5 truncate text-muted-foreground">
          {event.description}
        </p>
      )}
    </div>
  );
};

export type DayCalendarContentProps = HTMLAttributes<HTMLDivElement>;

export const DayCalendarContent = ({
  className,
  ...props
}: DayCalendarContentProps) => {
  const { date, events, startHour, endHour } = useDayCalendar();
  const totalHours = endHour - startHour;
  const hours = Array.from({ length: totalHours + 1 }, (_, i) => startHour + i);

  const now = new Date();
  const isToday =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  const currentHour = now.getHours() + now.getMinutes() / 60;
  const currentTimePercent = ((currentHour - startHour) / totalHours) * 100;
  const showCurrentTime =
    isToday && currentHour >= startHour && currentHour <= endHour;

  const currentTimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    currentTimeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  return (
    <div
      className={cn("relative overflow-auto", className)}
      data-slot="day-calendar-content"
      {...props}
    >
      <div className="relative" style={{ height: `${totalHours * 4}rem` }}>
        {hours.map((hour) => {
          const topPercent = ((hour - startHour) / totalHours) * 100;
          const label = new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            hour12: true,
          }).format(new Date(2000, 0, 1, hour));

          return (
            <div
              className="absolute left-0 right-0 flex items-start"
              key={hour}
              style={{ top: `${topPercent}%` }}
            >
              <span className="w-14 shrink-0 pr-2 text-right text-muted-foreground text-xs leading-none">
                {hour === startHour ? "" : label}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
          );
        })}

        {events.map((event) => (
          <DayCalendarEvent
            key={`${event.start.getTime()}-${event.title}`}
            event={event}
            startHour={startHour}
            totalHours={totalHours}
          />
        ))}

        {showCurrentTime && (
          <div
            className="absolute left-0 right-0 flex items-center"
            ref={currentTimeRef}
            style={{ top: `${currentTimePercent}%` }}
          >
            <span className="w-14 shrink-0" />
            <div className="h-0.5 flex-1 bg-red-500" />
            <div className="-translate-y-1/2 absolute left-14 size-2 rounded-full bg-red-500" />
          </div>
        )}
      </div>
    </div>
  );
};
