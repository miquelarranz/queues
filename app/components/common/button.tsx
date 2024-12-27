import { NavLink } from "@remix-run/react";

export type ButtonKind = "primary" | "secondary" | "default";
export type ButtonSize = "medium" | "small";

type Props = {
  text: string;
  fullRounded?: boolean;
  isLink?: boolean;
  gotToPath?: string;
  onClick?: VoidFunction;
  type?: "button" | "submit" | "reset";
  kind?: ButtonKind;
  size?: ButtonSize;
  disabled?: boolean;
  name?: string;
  value?: string;
};

const kindToClass: Record<ButtonKind, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  default: "btn",
};

const sizeToClass: Record<ButtonSize, string> = {
  medium: "",
  small: "btn-sm",
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
        }`
      }
    >
      {text}
    </NavLink>
  ) : (
    <button
      name={name}
      value={value}
      onClick={onClick}
      className={`${className} ${disabled ? "btn-disabled" : ""}`}
      type={type}
    >
      {text}
    </button>
  );
};
