import { ReactNode } from "react";

export const prismicTableComponents = {
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
    <td className="px-4 py-3 text-body-text leading-[22px] border-r border-border last:border-r-0">
      {children}
    </td>
  ),
};
