import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`h-[44px] w-full rounded-xs border border-border bg-background px-5 text-xs text-cream placeholder:text-muted focus:outline-none focus:border-accent transition-colors ${className}`}
      {...props}
    />
  );
}
