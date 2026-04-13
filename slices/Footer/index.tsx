import { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import CTAButton from "@/components/ui/CTAButton";

interface FooterSliceProps {
  slice: Content.CtaSlice;
  socialLinks?: Content.SocialsSliceDefaultPrimarySocialLinksItem[];
}

export default function FooterSlice({ slice, socialLinks }: FooterSliceProps) {
  const primary = slice.primary as unknown as {
    heading: Content.CtaSliceDefaultPrimary["heading"];
    footer_links?: {
      footer_link: { url?: string; text?: string; variant?: string };
    }[];
  };

  const footerLinks = primary.footer_links ?? [];

  return (
    <footer
      className="relative overflow-hidden border-t border-border bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('/images/footer-background.png')" }}
    >
      <div className="relative mx-auto max-w-[1440px] px-4 lg:px-0 py-16 lg:py-24 flex flex-col items-center gap-8 lg:gap-10">
        {/* Heading from Prismic */}
        <div className="[&_h1]:text-3xl lg:[&_h1]:text-6xl [&_h1]:leading-[1.15] [&_h1]:tracking-[-0.64px] [&_h1]:text-cream [&_h1]:font-normal [&_h1]:text-center">
          <PrismicRichText field={primary.heading} />
        </div>

        {/* Footer link buttons */}
        {footerLinks.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {footerLinks.map((item, idx) => {
              const link = item.footer_link;
              const variant =
                link.variant === "Secondary" ? "cream"
                : link.variant === "Tertiary" ? "tertiary"
                : "primary";
              const icon = link.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={link.url} alt="" className="size-3 shrink-0" />
              ) : undefined;
              return (
                <PrismicNextLink key={idx} field={link as Parameters<typeof PrismicNextLink>[0]["field"]}>
                  <CTAButton as="span" variant={variant} icon={icon}>
                    {link.text}
                  </CTAButton>
                </PrismicNextLink>
              );
            })}
          </div>
        )}

        {/* Social links */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-medium uppercase tracking-[1.5px] text-muted">
              Share
            </span>
            {socialLinks.map((item, idx) => {
              const url = "url" in item.social_link ? (item.social_link.url ?? "") : "";
              if (!url) return null;
              return (
                <PrismicNextLink
                  key={idx}
                  field={item.social_link}
                  className="opacity-50 hover:opacity-100 transition-opacity filter-[brightness(0)_invert(1)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" width={16} height={16} />
                </PrismicNextLink>
              );
            })}
          </div>
        )}
      </div>
    </footer>
  );
}
