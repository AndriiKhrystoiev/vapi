import { FC, ReactNode } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicTable } from "@prismicio/react";

/**
 * Props for `Table`.
 */
type TableContext = { allSlices?: unknown[] };

export type TableProps = SliceComponentProps<Content.TableSlice, TableContext>;

/**
 * Component for "Table" Slices.
 * Returns null on article pages — rendered inline by the Article component.
 */
const Table: FC<TableProps> = ({ slice, context }) => {
  if (context?.allSlices) return null;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mx-auto max-w-[1440px] px-[120px] py-8"
    >
      <div className="max-w-[734px]">
        {slice.primary.table_heading && (
          <h4 className="text-xl leading-7 text-cream font-medium mb-3">
            {slice.primary.table_heading}
          </h4>
        )}
        {slice.primary.table_description && (
          <div className="[&_p]:text-base [&_p]:leading-[27.2px] [&_p]:text-muted [&_p]:mb-4">
            <PrismicRichText field={slice.primary.table_description} />
          </div>
        )}
        {slice.primary.table_data && (
          <div className="overflow-x-auto rounded-[3px] border border-border">
            <PrismicTable
              field={slice.primary.table_data}
              components={{
                table: ({ children }: { children: ReactNode }) => (
                  <table className="w-full text-sm">{children}</table>
                ),
                thead: ({ children }: { children: ReactNode }) => (
                  <thead className="bg-surface">{children}</thead>
                ),
                tbody: ({ children }: { children: ReactNode }) => (
                  <tbody>{children}</tbody>
                ),
                tr: ({ children }: { children: ReactNode }) => (
                  <tr className="border-b border-border last:border-b-0">{children}</tr>
                ),
                th: ({ children }: { children: ReactNode }) => (
                  <th className="text-left px-4 py-3 text-cream font-medium text-xs uppercase tracking-[0.96px] font-mono border-r border-border last:border-r-0">
                    {children}
                  </th>
                ),
                td: ({ children }: { children: ReactNode }) => (
                  <td className="px-4 py-3 text-muted leading-[22px] border-r border-border last:border-r-0">
                    {children}
                  </td>
                ),
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Table;
