import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "cream" | "tertiary";
type Size = "default" | "small";

interface CTAButtonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  as?: "span" | "button";
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-[#0a0a0a]",
  secondary: "bg-[#09090b] border border-[#3f3f46] text-white",
  outline: "border border-border text-cream",
  cream: "bg-cream text-[#0a0a0a]",
  tertiary: "bg-surface-elevated border border-border text-white",
};

const sizeClasses: Record<Size, string> = {
  default: "h-[52px] px-4 py-2.5 text-sm",
  small: "h-[38px] px-5 text-[10px]",
};

export default function CTAButton({
  variant = "primary",
  size = "default",
  icon,
  as: Tag = "button",
  children,
  className = "",
}: CTAButtonProps) {
  return (
    <Tag
      className={`group inline-flex items-center gap-2.5 rounded-full font-mono font-medium uppercase tracking-[1.5px] ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
      {icon && (
        <span className="relative inline-flex size-4 shrink-0 overflow-hidden">
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:translate-x-full">
            {icon}
          </span>
          <span className="absolute inset-0 flex items-center justify-center -translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
            {icon}
          </span>
        </span>
      )}
    </Tag>
  );
}
