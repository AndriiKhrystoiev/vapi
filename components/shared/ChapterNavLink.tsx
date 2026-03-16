import { LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import ArrowLeft from "@/components/icons/arrow-left";
import ArrowRight from "@/components/icons/arrow-right";

interface ChapterNavLinkProps {
  field: LinkField;
  direction: "prev" | "next";
}

export default function ChapterNavLink({ field, direction }: ChapterNavLinkProps) {
  if (!field.text) return null;

  const icon = (
    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1e1e22] border border-transparent group-hover:bg-transparent group-hover:border-border-active transition-colors">
      {direction === "prev" ? <ArrowLeft /> : <ArrowRight />}
    </span>
  );

  const label = (
    <span className="text-lg text-muted group-hover:text-cream transition-colors">
      {field.text}
    </span>
  );

  return (
    <PrismicNextLink field={field} className="flex items-center gap-4 group">
      {direction === "prev" ? (
        <>
          {icon}
          {label}
        </>
      ) : (
        <>
          {label}
          {icon}
        </>
      )}
    </PrismicNextLink>
  );
}
