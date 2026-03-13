import { LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import CTAButton from "@/components/ui/CTAButton";
import Link from "next/link";

interface TopBarProps {
  ctaButton: LinkField;
}

export default function TopBar({ ctaButton }: TopBarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background">
      <div className="px-12 flex items-center justify-between h-[67px]">
        <Link href="/" className="font-mono text-base font-medium uppercase tracking-[1.5px]">
          <span className="text-white">Voice Agent </span>
          <span className="text-accent">Playbook</span>
        </Link>
        <PrismicNextLink field={ctaButton}>
          <CTAButton variant="primary" size="small">
            {ctaButton.text}
          </CTAButton>
        </PrismicNextLink>
      </div>
    </nav>
  );
}
