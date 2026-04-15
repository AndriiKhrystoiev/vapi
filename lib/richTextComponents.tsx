import { JSXMapSerializer } from "@prismicio/react";
import { slugify } from "@/helpers/slugify";

function textContent(node: { text?: string; spans?: unknown[] }): string {
  return node.text ?? "";
}

export const richTextComponents: JSXMapSerializer = {
  heading2: ({ node, children }) => {
    const id = slugify(textContent(node));
    return (
      <h2 id={id} className="scroll-mt-[140px] lg:scroll-mt-24">
        <a href={`#${id}`} className="!no-underline hover:underline !text-cream">
          {children}
        </a>
      </h2>
    );
  },
  heading3: ({ node, children }) => {
    const id = slugify(textContent(node));
    return (
      <h3 id={id} className="scroll-mt-[140px] lg:scroll-mt-24">
        <a href={`#${id}`} className="!no-underline hover:underline !text-cream">
          {children}
        </a>
      </h3>
    );
  },
};
