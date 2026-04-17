import { NextRequest, NextResponse } from "next/server";
import { asText, Content, RichTextField, TableField } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { jsPDF } from "jspdf";

interface RTNode {
  type: string;
  text?: string;
  spans?: { type: string }[];
}

// Ordered content blocks that mirror the article page layout
type Block =
  | { kind: "chapter"; index: number; title: string; content: RichTextField }
  | { kind: "table"; heading?: string; description?: RichTextField; data: TableField<"filled"> }
  | { kind: "richtext"; content: RichTextField };

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ uid: string }> },
) {
  const { uid } = await params;

  const client = createClient();
  let article: Content.ArticlepageDocument;
  try {
    article = await client.getByUID("articlepage", uid);
  } catch {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  // Collect all content blocks in slice order
  const blocks: Block[] = [];
  let partName = "";
  let chapterIndex = 0;

  for (const slice of article.data.slices) {
    if (slice.slice_type === "strategy_accordion" || slice.slice_type === "chapter") {
      const typed = slice as Content.StrategyAccordionSlice | Content.ChapterSlice;
      if (slice.slice_type === "strategy_accordion") {
        partName = (typed as Content.StrategyAccordionSlice).primary.part_name ?? "";
      }
      for (const ch of typed.primary.chapter ?? []) {
        if (ch.chapter_title && ch.chapter_content) {
          chapterIndex++;
          blocks.push({ kind: "chapter", index: chapterIndex, title: ch.chapter_title, content: ch.chapter_content });
        }
      }
    } else if (slice.slice_type === "table") {
      const t = slice as Content.TableSlice;
      if (t.primary.table_data) {
        blocks.push({
          kind: "table",
          heading: t.primary.table_heading ?? undefined,
          description: t.primary.table_description ?? undefined,
          data: t.primary.table_data as TableField<"filled">,
        });
      }
    } else if (slice.slice_type === "rich_text") {
      const r = slice as Content.RichTextSlice;
      if (r.primary.rich_text) {
        blocks.push({ kind: "richtext", content: r.primary.rich_text });
      }
    }
  }

  // --- PDF generation ---
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const renderTextLines = (lines: string[], x: number, lineHeight: number) => {
    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, x, y);
      y += lineHeight;
    }
  };

  const renderRichText = (field: RichTextField) => {
    const nodes = field as unknown as RTNode[];
    let listCounter = 0;

    for (const node of nodes) {
      switch (node.type) {
        case "heading2": {
          y += 4;
          ensureSpace(10);
          doc.setFontSize(15);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0);
          const h2Lines = doc.splitTextToSize(node.text ?? "", contentWidth);
          renderTextLines(h2Lines, margin, 6.5);
          y += 4;
          break;
        }
        case "heading3": {
          y += 3;
          ensureSpace(8);
          doc.setFontSize(13);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0);
          const h3Lines = doc.splitTextToSize(node.text ?? "", contentWidth);
          renderTextLines(h3Lines, margin, 6);
          y += 3;
          break;
        }
        case "heading4":
        case "heading5":
        case "heading6": {
          y += 2;
          ensureSpace(7);
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0);
          const hLines = doc.splitTextToSize(node.text ?? "", contentWidth);
          renderTextLines(hLines, margin, 5.5);
          y += 2;
          break;
        }
        case "paragraph": {
          const text = node.text ?? "";
          if (!text.trim()) { y += 3; break; }
          const hasBold = node.spans?.some((s) => s.type === "strong");
          if (hasBold && text.length < 80) {
            y += 2;
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0);
          } else {
            doc.setFontSize(10.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(50);
          }
          const pLines = doc.splitTextToSize(text, contentWidth);
          renderTextLines(pLines, margin, 5);
          y += 3;
          break;
        }
        case "list-item": {
          doc.setFontSize(10.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(50);
          const bulletLines = doc.splitTextToSize(node.text ?? "", contentWidth - 8);
          ensureSpace(bulletLines.length * 5);
          doc.text("\u2022", margin + 2, y);
          renderTextLines(bulletLines, margin + 8, 5);
          y += 2;
          break;
        }
        case "o-list-item": {
          listCounter++;
          doc.setFontSize(10.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(50);
          const olLines = doc.splitTextToSize(node.text ?? "", contentWidth - 10);
          ensureSpace(olLines.length * 5);
          doc.text(`${listCounter}.`, margin + 1, y);
          renderTextLines(olLines, margin + 10, 5);
          y += 2;
          break;
        }
        case "preformatted": {
          y += 2;
          doc.setFontSize(9);
          doc.setFont("courier", "normal");
          doc.setTextColor(60);
          const preLines = doc.splitTextToSize(node.text ?? "", contentWidth - 8);
          const blockH = preLines.length * 4.5 + 6;
          ensureSpace(blockH);
          doc.setFillColor(240, 240, 240);
          doc.rect(margin, y - 3, contentWidth, blockH, "F");
          renderTextLines(preLines, margin + 4, 4.5);
          y += 5;
          doc.setFont("helvetica", "normal");
          break;
        }
        default:
          break;
      }
      if (node.type !== "o-list-item") listCounter = 0;
    }
  };

  const renderTable = (data: TableField<"filled">) => {
    // Extract cell texts
    const headerRow = data.head?.rows[0]?.cells.map((c) => asText(c.content)) ?? [];
    const bodyRows = data.body.rows.map((r) => r.cells.map((c) => asText(c.content)));
    const allRows = headerRow.length > 0 ? [headerRow, ...bodyRows] : bodyRows;
    if (allRows.length === 0) return;

    const colCount = allRows[0].length;
    if (colCount === 0) return;

    const colWidth = contentWidth / colCount;
    const cellPadding = 2;
    const cellContentWidth = colWidth - cellPadding * 2;
    const rowHeight = 7;

    // Calculate row heights based on content
    const rowHeights = allRows.map((row) => {
      let maxLines = 1;
      doc.setFontSize(9);
      for (const cell of row) {
        const lines = doc.splitTextToSize(cell, cellContentWidth);
        maxLines = Math.max(maxLines, lines.length);
      }
      return maxLines * 4 + cellPadding * 2;
    });

    y += 4;

    for (let r = 0; r < allRows.length; r++) {
      const row = allRows[r];
      const rh = Math.max(rowHeights[r], rowHeight);
      const isHeader = headerRow.length > 0 && r === 0;

      ensureSpace(rh + 2);

      // Row background
      if (isHeader) {
        doc.setFillColor(230, 230, 230);
        doc.rect(margin, y, contentWidth, rh, "F");
      } else if (r % 2 === 0) {
        doc.setFillColor(248, 248, 248);
        doc.rect(margin, y, contentWidth, rh, "F");
      }

      // Cell borders and text
      for (let c = 0; c < colCount; c++) {
        const x = margin + c * colWidth;
        doc.setDrawColor(210);
        doc.setLineWidth(0.2);
        doc.rect(x, y, colWidth, rh);

        doc.setFontSize(9);
        doc.setTextColor(isHeader ? 0 : 50);
        doc.setFont("helvetica", isHeader ? "bold" : "normal");
        const cellText = row[c] ?? "";
        const lines = doc.splitTextToSize(cellText, cellContentWidth);
        for (let l = 0; l < lines.length; l++) {
          doc.text(lines[l], x + cellPadding, y + cellPadding + 3 + l * 4);
        }
      }

      y += rh;
    }

    y += 6;
  };

  // --- Part title ---
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  const titleLines = doc.splitTextToSize(partName || uid, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 12 + 8;

  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // --- Render blocks in order ---
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    switch (block.kind) {
      case "chapter": {
        // Separator before chapter (except the first)
        if (i > 0) {
          y += 6;
          ensureSpace(15);
          doc.setDrawColor(220);
          doc.setLineWidth(0.3);
          doc.line(margin, y, pageWidth - margin, y);
          y += 12;
        }

        ensureSpace(25);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(130);
        doc.text(`CHAPTER ${block.index}`, margin, y);
        y += 7;

        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        const headingLines = doc.splitTextToSize(block.title, contentWidth);
        ensureSpace(headingLines.length * 8);
        doc.text(headingLines, margin, y);
        y += headingLines.length * 8 + 6;

        renderRichText(block.content);
        break;
      }

      case "table": {
        if (block.heading) {
          y += 4;
          ensureSpace(10);
          doc.setFontSize(13);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0);
          const thLines = doc.splitTextToSize(block.heading, contentWidth);
          renderTextLines(thLines, margin, 6);
          y += 2;
        }
        if (block.description) {
          doc.setFontSize(10.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(50);
          const descText = asText(block.description).trim();
          if (descText) {
            const descLines = doc.splitTextToSize(descText, contentWidth);
            renderTextLines(descLines, margin, 5);
            y += 3;
          }
        }
        renderTable(block.data);
        break;
      }

      case "richtext": {
        renderRichText(block.content);
        break;
      }
    }
  }

  const buffer = doc.output("arraybuffer");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${uid}.pdf"`,
    },
  });
}
