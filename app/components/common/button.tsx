import { NavLink } from "@remix-run/react";
import { ReactNode, MouseEvent } from "react";

export type ButtonKind =
  | "primary"
  | "secondary"
  | "default"
  | "error"
  | "ghost";
export type ButtonSize = "medium" | "small" | "micro";

type Props = {
  text?: string;
  fullRounded?: boolean;
  isLink?: boolean;
  gotToPath?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  kind?: ButtonKind;
  size?: ButtonSize;
  disabled?: boolean;
  name?: string;
  value?: string;
  outlined?: boolean;
  leftIcon?: ReactNode;
};

const kindToClass: Record<ButtonKind, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  default: "btn",
  error: "btn btn-error",
  ghost: "btn btn-ghost",
};

const sizeToClass: Record<ButtonSize, string> = {
  medium: "",
  small: "btn-sm",
  micro: "btn-xs",
};

export const Button = ({
  text,
  fullRounded,
  isLink,
  gotToPath,
  name,
  onClick = () => {},
  type = "button",
  disabled = false,
  kind = "default",
  size = "medium",
  value,
  outlined,
  leftIcon,
}: Props) => {
  const className = `${kindToClass[kind]} ${sizeToClass[size]} ${
    fullRounded ? "btn-circle" : ""
  }`;
  const isValidLink = isLink && gotToPath;

  return isValidLink ? (
    <NavLink
      to={gotToPath}
      className={({ isActive }) =>
        `${className} ${isActive ? "" : "btn-outline"} ${
          disabled ? "btn-disabled" : ""
        }
        ${outlined ? "btn-outline" : ""}`
      }
    >
      {leftIcon && leftIcon}
      {text && text}
    </NavLink>
  ) : (
    <button
      name={name}
      value={value}
      onClick={onClick}
      className={`${className} ${disabled ? "btn-disabled" : ""} ${
        outlined ? "btn-outline" : ""
      }`}
      type={type}
    >
      {leftIcon && leftIcon}
      {text && text}
    </button>
  );
};
