interface ChapterStatusIconProps {
  status: "read" | "active" | "unread";
}

export default function ChapterStatusIcon({ status }: ChapterStatusIconProps) {
  if (status === "read") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" className="stroke-accent" strokeWidth="1.2" />
        <path d="M5.5 8L7 9.5L10.5 6.5" className="stroke-accent" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (status === "active") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" className="stroke-chapter-active" strokeWidth="1.2" />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" className="stroke-chapter-unread" strokeWidth="1.2" />
    </svg>
  );
}
