import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/search-input";

export default function ExamHero({ t }: { t: any }) {
  return (
    <div className="relative overflow-hidden bg-slate-900 py-24 sm:py-32 rounded-3xl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')] bg-cover bg-center opacity-20" />
      <div className="relative container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {t.discover_title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            {t.discover_description}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <div className="w-full max-w-md">
                <SearchInput />
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white/20">
              IT Certifications
            </Button>
            <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white/20">
              Language Tests
            </Button>
            <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white/20">
              Medical Exams
            </Button>
            <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white/20">
              Bar Exams
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
