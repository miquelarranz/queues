import { NavLink } from "@remix-run/react";

export type ButtonColors =
  | "blue"
  | "orange"
  | "green"
  | "red"
  | "sky"
  | "slate";

type Props = {
  text: string;
  color: ButtonColors;
  fullRounded?: boolean;
  isLink?: boolean;
  gotToPath?: string;
  onClick?: VoidFunction;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const DEFAULT_PROPS = {
  text: "Button",
  color: "blue" as ButtonColors,
  type: "button" as Props["type"],
};

const colorToClass = {
  slate: "bg-slate-400 hover:bg-slate-300",
  blue: "bg-blue-400 hover:bg-blue-300",
  orange: "bg-orange-400 hover:bg-orange-300",
  green: "bg-green-400 hover:bg-green-300",
  red: "bg-red-400 hover:bg-red-300",
  sky: "bg-sky-400 hover:bg-sky-300",
};

const colorToActiveClass = {
  slate: "bg-slate-600 hover:bg-slate-500",
  blue: "bg-blue-600 hover:bg-blue-500",
  orange: "bg-orange-600 hover:bg-orange-500",
  green: "bg-green-600 hover:bg-green-500",
  red: "bg-red-600 hover:bg-red-500",
  sky: "bg-sky-600 hover:bg-sky-500",
};

export const Button = ({
  text,
  color,
  fullRounded,
  isLink,
  gotToPath,
  onClick,
  type,
  disabled,
}: Props = DEFAULT_PROPS) => {
  const className = `${colorToClass[color]} shadow-md ${
    fullRounded ? "rounded-full" : "rounded-lg"
  } text-white px-4 py-2 h-10`;
  const isValidLink = isLink && gotToPath;

  return isValidLink ? (
    <NavLink
      to={gotToPath}
      className={({ isActive }) =>
        `${className} ${
          isActive ? `drop-shadow-xl ${colorToActiveClass[color]}` : ""
        } ${disabled ? "cursor-not-allowed opacity-25" : ""}`
      }
    >
      {text}
    </NavLink>
  ) : (
    <button
      onClick={onClick}
      className={`${className} ${
        disabled ? "cursor-not-allowed opacity-25" : ""
      }`}
      type={type}
    >
      {text}
    </button>
  );
};
