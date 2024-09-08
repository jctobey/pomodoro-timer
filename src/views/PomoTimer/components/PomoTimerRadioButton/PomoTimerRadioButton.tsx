import { ReactNode } from "react";
import { classNames } from "../../../utils";
import "./styles.css";

type ButtonVariants = "primary" | "secondary";

export const PomoTimerRadioButton = ({
  name,
  value,
  onChange,
  children,
  variant = "primary",
  size = "default",
  isActive = false,
  isDisabled = false,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  variant?: ButtonVariants;
  size?: "default" | "sm";
  isActive?: boolean;
  isDisabled?: boolean;
}) => (
  <label
    className={classNames("radio-button", variant, size, { active: isActive })}
  >
    <input
      type="radio"
      name={name}
      value={value}
      checked={isActive}
      onChange={() => onChange(value)}
      disabled={isDisabled}
      aria-checked={isActive}
      className="sr-only"
    />
    {children}
  </label>
);
