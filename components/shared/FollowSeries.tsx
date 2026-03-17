"use client";

import Input from "@/components/ui/Input";
import CTAButton from "@/components/ui/CTAButton";

interface FollowSeriesProps {
  title?: string;
  description?: string;
}

export default function FollowSeries({
  title = "Follow the series",
  description = "New chapters every two weeks.",
}: FollowSeriesProps) {
  return (
    <div className="rounded-[3px] bg-[#142121] border border-border-active p-5 flex flex-col gap-4">
      <h3 className="text-base font-semibold text-accent">{title}</h3>
      <p className="text-sm text-muted">{description}</p>
      <Input type="email" placeholder="you@company.com" />
      <CTAButton as="button" variant="primary" className="w-full justify-center">
        Subscribe
      </CTAButton>
    </div>
  );
}
