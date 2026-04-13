import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicTable } from "@prismicio/react";
import { prismicTableComponents } from "@/lib/tableComponents";

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
          <div className="[&_p]:text-base [&_p]:leading-[27.2px] [&_p]:text-body-text [&_p]:mb-4">
            <PrismicRichText field={slice.primary.table_description} />
          </div>
        )}
        {slice.primary.table_data && (
          <div className="overflow-x-auto rounded-[3px] border border-border">
            <PrismicTable
              field={slice.primary.table_data}
              components={prismicTableComponents}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Table;
