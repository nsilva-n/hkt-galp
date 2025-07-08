"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import "./styles/Button.css";

export default function Button({
  variant = "primary",
  arrow = false,
  disabled = false,
  className = "",
  children,
  fullWidth,
  ...rest
}) {
  const arrowIcon =
    arrow === "left" ? (
      <ArrowLeft className="button__icon" strokeWidth={2} />
    ) : arrow === "right" ? (
      <ArrowRight className="button__icon" strokeWidth={2} />
    ) : null;


  const classes = [
    "button",
    `button--${variant}`,
    disabled ? "button--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" disabled={disabled} className={classes} {...rest}>
      {arrow === "left" && arrowIcon}
      <span className="button__label">{children}</span>
      {arrow === "right" && arrowIcon}
    </button>
  );
}

