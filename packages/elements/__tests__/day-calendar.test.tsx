import { render, screen } from "@testing-library/react";

import {
  DayCalendar,
  DayCalendarContent,
  DayCalendarEvent,
  DayCalendarHeader,
  type CalendarEvent,
} from "../src/day-calendar";

const date = new Date("2025-02-27T00:00:00");

const events: CalendarEvent[] = [
  {
    description: "Daily sync",
    end: new Date("2025-02-27T17:00:00"),
    start: new Date("2025-02-27T16:00:00"),
    title: "Team Standup",
  },
];

describe("dayCalendar", () => {
  it("renders children", () => {
    render(
      <DayCalendar date={date} events={[]}>
        <span>Content</span>
      </DayCalendar>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("throws error when sub-component used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(vi.fn());

    expect(() => render(<DayCalendarHeader />)).toThrow(
      "DayCalendar components must be used within DayCalendar"
    );

    spy.mockRestore();
  });
});

describe("dayCalendarHeader", () => {
  it("renders formatted date", () => {
    render(
      <DayCalendar date={date} events={[]}>
        <DayCalendarHeader />
      </DayCalendar>
    );

    expect(screen.getByText("Thursday, February 27, 2025")).toBeInTheDocument();
  });

  it("renders custom children instead of formatted date", () => {
    render(
      <DayCalendar date={date} events={[]}>
        <DayCalendarHeader>Custom Header</DayCalendarHeader>
      </DayCalendar>
    );

    expect(screen.getByText("Custom Header")).toBeInTheDocument();
    expect(
      screen.queryByText("Thursday, February 27, 2025")
    ).not.toBeInTheDocument();
  });
});

describe("dayCalendarContent", () => {
  it("renders time grid", () => {
    render(
      <DayCalendar date={date} events={[]} endHour={11} startHour={9}>
        <DayCalendarContent />
      </DayCalendar>
    );

    expect(screen.getByText("10 AM")).toBeInTheDocument();
    expect(screen.getByText("11 AM")).toBeInTheDocument();
  });

  it("renders event titles", () => {
    render(
      <DayCalendar date={date} events={events}>
        <DayCalendarContent />
      </DayCalendar>
    );

    expect(screen.getByText("Team Standup")).toBeInTheDocument();
  });

  it("renders event description", () => {
    render(
      <DayCalendar date={date} events={events}>
        <DayCalendarContent />
      </DayCalendar>
    );

    expect(screen.getByText("Daily sync")).toBeInTheDocument();
  });

  it("defaults to 9am-5pm when no events", () => {
    render(
      <DayCalendar date={date} events={[]}>
        <DayCalendarContent />
      </DayCalendar>
    );

    expect(screen.getByText("10 AM")).toBeInTheDocument();
    expect(screen.getByText("5 PM")).toBeInTheDocument();
  });
});

describe("dayCalendarEvent", () => {
  it("renders event title and time range", () => {
    render(
      <DayCalendar date={date} events={events}>
        <DayCalendarEvent
          event={events[0]}
          startHour={14}
          totalHours={6}
        />
      </DayCalendar>
    );

    expect(screen.getByText("Team Standup")).toBeInTheDocument();
    expect(screen.getByText(/4:00 PM/)).toBeInTheDocument();
    expect(screen.getByText(/5:00 PM/)).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <DayCalendar date={date} events={events}>
        <DayCalendarEvent
          event={events[0]}
          startHour={14}
          totalHours={6}
        />
      </DayCalendar>
    );

    expect(screen.getByText("Daily sync")).toBeInTheDocument();
  });

  it("omits description when not provided", () => {
    const eventNoDesc: CalendarEvent = {
      end: new Date("2025-02-27T17:00:00"),
      start: new Date("2025-02-27T16:00:00"),
      title: "No Desc Event",
    };

    render(
      <DayCalendar date={date} events={[eventNoDesc]}>
        <DayCalendarEvent
          event={eventNoDesc}
          startHour={14}
          totalHours={6}
        />
      </DayCalendar>
    );

    expect(screen.getByText("No Desc Event")).toBeInTheDocument();
  });
});
