import { useEffect, useState } from "react";
import { useInterval } from "./hooks";
import "./styles.css";
import useSound from "use-sound";
import alarmClockSfx from "../PomoTimer/assets/Ring-sound-effect.mp3";
import { PomoTimerButton } from "./components/PomoTimerButton";
import { PomoTimerRadioButton } from "./components/PomoTimerRadioButton";
const SECOND = 1000;

const MINUTE = SECOND * 60;

enum Duration {
  POMODORO = MINUTE * 25,
  SHORT_BREAK = MINUTE * 5,
  LONG_BREAK = MINUTE * 15,
}

enum Button {
  POMODORO = "Pomodoro",
  SHORT_BREAK = "Short Break",
  LONG_BREAK = "Long Break",
}

const POMOS_BEFORE_LONG_BREAK_DEFAULT = 3;

function secondsToTimeMinutesSeconds(miliseconds: number): string {
  const seconds = miliseconds / SECOND;
  const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0"),
    s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
  return m + ":" + s;
}

export const PomoTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState<number>(Duration.POMODORO);
  const [activeButton, setActiveButton] = useState<Button>(Button.POMODORO);
  const [pomosWithoutLongBreak, setPomosWithoutLongBreak] = useState<number>(0);
  const [isRunningTimer, setIsRunningTimer] = useState<boolean>(false);

  const timeRemainingMinutesSeconds =
    secondsToTimeMinutesSeconds(timeRemaining);

  const [play, { stop }] = useSound(alarmClockSfx);

  const handleUpdateSelectedButton = (duration: Duration, button: Button) => {
    setTimeRemaining(duration);
    setActiveButton(button);
  };

  const handleUpdateActiveDuration = (prev: Button) => {
    if (prev === Button.POMODORO) {
      const newPomosWithoutLongBreak = pomosWithoutLongBreak + 1;
      if (newPomosWithoutLongBreak === POMOS_BEFORE_LONG_BREAK_DEFAULT) {
        handleUpdateSelectedButton(Duration.LONG_BREAK, Button.LONG_BREAK);
        setPomosWithoutLongBreak(0);
      } else {
        setPomosWithoutLongBreak(newPomosWithoutLongBreak);
        handleUpdateSelectedButton(Duration.SHORT_BREAK, Button.SHORT_BREAK);
      }
    }
    if (prev === Button.SHORT_BREAK) {
      handleUpdateSelectedButton(Duration.POMODORO, Button.POMODORO);
    }
    if (prev === Button.LONG_BREAK) {
      handleUpdateSelectedButton(Duration.LONG_BREAK, Button.LONG_BREAK);
    }
  };

  const handleAlarm = () => {
    play();
    //play our sound for 3 seconds
    setTimeout(() => {
      stop();
    }, 3000);
    setIsRunningTimer(false);
    //set the timer based on previous active button state
    handleUpdateActiveDuration(activeButton);
  };

  useInterval(() => {
    if (!isRunningTimer) {
      return;
    }
    if (timeRemaining === 0) {
      handleAlarm();
      return;
    }
    const newTimeRemaining = timeRemaining - SECOND;
    setTimeRemaining(newTimeRemaining);
  }, 1000);

  //whenever the time remaining is updated, update the doc title which
  //updates the browser tab display
  useEffect(() => {
    document.title = `${secondsToTimeMinutesSeconds(
      timeRemaining
    )} - PomoTimer`;
  }, [timeRemaining]);

  const handleToggleTimer = () => setIsRunningTimer(!isRunningTimer);

  const handlePause = () => setIsRunningTimer(false);

  const getIsActiveButton = (button: Button): boolean =>
    button === activeButton;

  const handleChangeDuration = (
    activeButton: Button,
    timeRemaining: Duration
  ) => {
    setActiveButton(activeButton);
    setTimeRemaining(timeRemaining);
    handlePause();
  };

  return (
    <div className="pomotimer-layout">
      <ul
        className="pomotimer-durations"
        role="radiogroup"
        aria-activedescendant={activeButton}
        tabIndex={-1}
      >
        <PomoTimerRadioButton
          name="pomo-timer"
          id={Button.POMODORO}
          value={Button.POMODORO}
          isActive={getIsActiveButton(Button.POMODORO)}
          onChange={() =>
            handleChangeDuration(Button.POMODORO, Duration.POMODORO)
          }
        >
          Pomodoro
        </PomoTimerRadioButton>
        <PomoTimerRadioButton
          name="pomo-timer"
          id={Button.SHORT_BREAK}
          value={Button.SHORT_BREAK}
          isActive={getIsActiveButton(Button.SHORT_BREAK)}
          onChange={() =>
            handleChangeDuration(Button.SHORT_BREAK, Duration.SHORT_BREAK)
          }
        >
          Short Break
        </PomoTimerRadioButton>
        <PomoTimerRadioButton
          name="pomo-timer"
          id={Button.LONG_BREAK}
          value={Button.LONG_BREAK}
          isActive={getIsActiveButton(Button.LONG_BREAK)}
          onChange={() =>
            handleChangeDuration(Button.LONG_BREAK, Duration.LONG_BREAK)
          }
        >
          Long Break
        </PomoTimerRadioButton>
      </ul>
      <span className="pomotimer-remaining-time">
        {timeRemainingMinutesSeconds}
      </span>
      <div className="pomotimer-actions">
        <PomoTimerButton
          variant="secondary"
          size="default"
          onClick={handleToggleTimer}
        >
          {isRunningTimer ? "Pause" : "Start"}
        </PomoTimerButton>
      </div>
    </div>
  );
};
