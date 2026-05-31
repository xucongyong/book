"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent } from "react";
import { useLocale } from "next-intl";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const [value, setValue] = useState(searchParams.get("q") || "");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-sm lg:w-[200px] xl:w-[300px]">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search models..."
          className="pl-9 h-9 bg-muted/50 focus:bg-background transition-colors"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </form>
  );
}
