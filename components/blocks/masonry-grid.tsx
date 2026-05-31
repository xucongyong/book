import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MasonryGridProps {
  children: ReactNode;
  className?: string;
}

export default function MasonryGrid({ children, className }: MasonryGridProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 space-y-4 gap-4">
        {children}
      </div>
    </div>
  );
}
