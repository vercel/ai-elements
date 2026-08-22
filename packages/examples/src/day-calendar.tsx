"use client";

import {
  DayCalendar,
  DayCalendarContent,
  DayCalendarHeader,
} from "@repo/elements/day-calendar";
import type { CalendarEvent } from "@repo/elements/day-calendar";

const date = new Date("2025-02-27");

const events: CalendarEvent[] = [
  {
    description: "Daily sync with the engineering team",
    end: new Date("2025-02-27T17:00:00"),
    start: new Date("2025-02-27T16:00:00"),
    title: "Team Standup",
  },
];

const Example = () => (
  <DayCalendar className="max-w-sm" date={date} events={events}>
    <DayCalendarHeader />
    <DayCalendarContent />
  </DayCalendar>
);

export default Example;
