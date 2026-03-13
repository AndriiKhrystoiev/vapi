import { LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { DocumentIcon, LinkIcon } from "@/components/icons";

interface DocumentLinkListProps {
  links: LinkField[];
}

export default function DocumentLinkList({ links }: DocumentLinkListProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="flex flex-col w-full gap-1">
      {links.map((doc, index) => (
        <PrismicNextLink
          key={index}
          field={doc}
          className="flex items-center justify-between w-full px-4 py-3 border border-border bg-surface hover:bg-background text-link text-sm rounded-[3px] transition-all"
        >
          <span className="flex items-center gap-3">
            <DocumentIcon />
            {doc.text}
          </span>
          <LinkIcon />
        </PrismicNextLink>
      ))}
    </div>
  );
}
