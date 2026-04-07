"use client";

import { useState } from "react";
import { LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import CTAButton from "@/components/ui/CTAButton";
import { AngleRight, MenuDots, MenuDotsOpen } from "@/components/icons";
import Link from "next/link";
import Image from "next/image";

interface TopBarProps {
  headerLinks: LinkField[];
  ctaButton: LinkField;
}

export default function TopBar({ headerLinks, ctaButton }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-[120px] flex items-center h-[67px]">
          {/* Logo + Title */}
          <Link href="/" className="flex items-center gap-3 font-mono text-base font-medium uppercase tracking-[1.5px]">
            <Image src="/logo.svg" alt="Vapi" width={32} height={16} />
            <span className="text-white">Voice Agent Playbook</span>
          </Link>

          {/* Nav Links — desktop only, centered */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-10">
            {headerLinks.map((link, i) => (
              <PrismicNextLink
                key={i}
                field={link}
                className="font-mono text-xs font-medium uppercase tracking-[1.5px] text-muted hover:text-cream transition-colors"
              />
            ))}
          </div>

          {/* Spacer for mobile */}
          <div className="flex-1 lg:hidden" />

          {/* CTA Button — desktop only */}
          <PrismicNextLink field={ctaButton} className="hidden lg:block">
            <CTAButton variant="outline" size="small">
              {ctaButton.text}
            </CTAButton>
          </PrismicNextLink>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="lg:hidden flex items-center justify-center bg-[#18181b] border border-[#3f3f46] rounded-full px-4 py-2.5 h-9 cursor-pointer ml-3"
          >
            {menuOpen ? <MenuDotsOpen /> : <MenuDots />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[45] bg-[#0e0e12] flex flex-col lg:hidden">
          {/* Header — same as top bar but with close icon */}
          <div className="h-[67px] shrink-0" />

          {/* Scrollable nav links */}
          <div className="flex-1 overflow-y-auto px-4 pt-6">
            <div className="flex flex-col">
              {headerLinks.map((link, i) => (
                <PrismicNextLink
                  key={i}
                  field={link}
                  onClick={() => setMenuOpen(false)}
                  className="font-mono text-sm font-medium uppercase tracking-[1.5px] text-cream py-5 border-b border-cream/12"
                />
              ))}
            </div>
          </div>

          {/* Fixed bottom CTA */}
          <div className="shrink-0 px-4 py-6 border-t border-cream/12">
            <PrismicNextLink field={ctaButton} onClick={() => setMenuOpen(false)}>
              <CTAButton variant="outline" size="small">
                {ctaButton.text}
              </CTAButton>
            </PrismicNextLink>
          </div>
        </div>
      )}
    </>
  );
}

interface ArticleTopBarProps {
  partName?: string | null;
  ctaButton?: LinkField;
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
}

export function ArticleTopBar({ partName, ctaButton, onMenuClick, isMenuOpen }: ArticleTopBarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] bg-background border-b border-border">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-[120px] flex items-center h-[67px]">
        {/* Logo + Breadcrumb */}
        <div className="flex items-center gap-3 font-mono text-sm font-medium uppercase tracking-[1.5px]">
          <Link href="/">
            <Image src="/logo.svg" alt="Vapi" width={32} height={16} />
          </Link>
          <Link href="/" className="text-muted hover:text-cream transition-colors">
            Playbook
          </Link>
          {partName && (
            <>
              <AngleRight color="#a1a1ab" />
              <span className="text-cream">{partName}</span>
            </>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA Button — desktop only */}
        {ctaButton && "text" in ctaButton && ctaButton.text && (
          <PrismicNextLink field={ctaButton} className="hidden lg:block">
            <CTAButton variant="outline" size="small">
              {ctaButton.text}
            </CTAButton>
          </PrismicNextLink>
        )}

        {/* Mobile menu button */}
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden flex items-center justify-center bg-[#18181b] border border-[#3f3f46] rounded-full px-4 py-2.5 h-9 cursor-pointer"
          >
            {isMenuOpen ? <MenuDotsOpen /> : <MenuDots />}
          </button>
        )}
      </div>
    </nav>
  );
}
