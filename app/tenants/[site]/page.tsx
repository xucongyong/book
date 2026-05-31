
import { getSiteByDomain } from "@/lib/sites";
import { notFound } from "next/navigation";
import { PricingTable } from "@/components/commerce/PricingTable";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { Instagram, Twitter } from "lucide-react"; // Assuming lucide-react is available

export default async function TenantPage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;
  const decodedSite = decodeURIComponent(site);
  
  console.log("TenantPage: site param =", site);

  const siteConfig = await getSiteByDomain(decodedSite);

  if (!siteConfig) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero / Header Section */}
      <div className="bg-white border-b">
        <div className="h-48 bg-gradient-to-r from-pink-400 to-purple-500 w-full relative">
           <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
                {/* Placeholder Avatar */}
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${siteConfig.id}`} alt="Avatar" className="w-full h-full bg-white"/>
              </div>
           </div>
        </div>
        <div className="pt-20 pb-8 text-center px-4">
           <h1 className="text-3xl font-bold text-gray-900">{siteConfig.name}</h1>
           <p className="max-w-xl mx-auto mt-2 text-gray-600">
             {siteConfig.description || "Digital Creator & Influencer ✨ Sharing my exclusive life here."}
           </p>
           <div className="flex justify-center gap-4 mt-4">
             <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
               <Instagram className="w-5 h-5 text-pink-600" />
             </button>
             <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Twitter className="w-5 h-5 text-blue-400" />
             </button>
           </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Membership Section */}
        <PricingTable />
        
        <div className="my-12 border-t border-gray-200" />

        {/* Content & Services Section */}
        <ProductGrid />

        {/* Debug Info (Optional, remove in production) */}
        <div className="mt-16 p-4 bg-gray-100 rounded text-xs text-gray-400 text-center">
           Site ID: {siteConfig.id} | Domain: {siteConfig.domain}
        </div>
      </main>
    </div>
  );
}
