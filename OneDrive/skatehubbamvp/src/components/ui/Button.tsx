import React from "react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" };
export default function Button({ variant = "primary", className = "", ...props }: Props) {
  const base = "px-4 py-2 rounded font-semibold transition";
  const v =
    variant === "ghost"
      ? "bg-transparent border border-white/20 hover:border-white/40"
      : "bg-hubba-orange hover:opacity-90";
  return <button className={`${base} ${v} ${className}`} {...props} />;
}