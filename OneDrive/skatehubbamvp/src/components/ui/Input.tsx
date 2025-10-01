import React from "react";
type Props = React.InputHTMLAttributes<HTMLInputElement>;
export default function Input(props: Props) {
  return (
    <input
      className="w-full px-3 py-2 rounded bg-black/60 border border-white/20 focus:border-hubba-orange outline-none"
      {...props}
    />
  );
}