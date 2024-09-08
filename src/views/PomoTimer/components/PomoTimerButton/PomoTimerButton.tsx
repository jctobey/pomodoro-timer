import { ReactNode } from "react";
import { classNames } from "../../../utils";
import "./styles.css";

type ButtonVariants = "primary" | "secondary";

export const PomoTimerButton = ({
  onClick,
  children,
  variant = "primary",
  size = "default",
  isActive = false,
  isDisabled = false,
}: {
  onClick: () => void;
  children: ReactNode;
  variant?: ButtonVariants;
  size?: "default" | "sm";
  isActive?: boolean;
  isDisabled?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`${classNames(variant, size, { active: isActive })}`}
    disabled={isDisabled}
  >
    {children}
  </button>
);
