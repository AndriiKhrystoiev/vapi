import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "cream";
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
};

const sizeClasses: Record<Size, string> = {
  default: "h-[52px] px-4 py-2.5 text-sm",
  small: "h-[38px] px-5 text-[10px]",
};

export default function CTAButton({
  variant = "primary",
  size = "default",
  icon,
  as: Tag = "span",
  children,
  className = "",
}: CTAButtonProps) {
  return (
    <Tag
      className={`inline-flex items-center gap-2.5 rounded-full font-mono font-medium uppercase tracking-[1.5px] ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
      {icon}
    </Tag>
  );
}
