// components/ui/Card.jsx
"use client";

import React from "react";
import "./styles/Card.css";

export default function Card({ children, className = "", padding = "md", ...props }) {
  const classes = [
    "card",
    `card--padding-${padding}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
