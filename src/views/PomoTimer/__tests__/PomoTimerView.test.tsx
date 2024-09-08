import { act, render, screen, Screen, waitFor } from "@testing-library/react";
import { PomoTimer } from "../PomoTimer";
import userEvent from "@testing-library/user-event";

describe("Pomo Timer View", () => {
  beforeEach(() => {
    //mock the timers, so that we don't have to wait 5/15/25 minutes for the business logic to execute
    jest.useFakeTimers();
    jest.runOnlyPendingTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  const getLongBreakEl = (screen: Screen) =>
    screen.getByRole("radio", {
      name: /long break/i,
      hidden: true,
    });

  const getShortBreakEl = (screen: Screen) =>
    screen.getByRole("radio", {
      name: /short break/i,
      hidden: true,
    });

  it("defaults to pomodoro timer selected", () => {
    render(<PomoTimer />);

    expect(
      screen.getByRole("radio", { name: /pomodoro/i, hidden: true })
    ).toBeChecked();
    expect(
      screen.getByRole("radio", { name: /short break/i, hidden: true })
    ).not.toBeChecked();
    expect(
      screen.getByRole("radio", { name: /long break/i, hidden: true })
    ).not.toBeChecked();
    expect(screen.getByText("25:00")).toBeInTheDocument();
  });
  it("switches timer when different selection is made", () => {
    render(<PomoTimer />);

    expect(
      screen.getByRole("radio", { name: /pomodoro/i, hidden: true })
    ).toBeChecked();

    const shortBreakEl = getShortBreakEl(screen);
    const longBreakEl = getLongBreakEl(screen);

    userEvent.click(shortBreakEl);

    expect(shortBreakEl).toBeChecked();
    expect(screen.getByText("05:00")).toBeInTheDocument();

    userEvent.click(longBreakEl);

    expect(longBreakEl).toBeChecked();
    expect(screen.getByText("15:00")).toBeInTheDocument();
  });
});
