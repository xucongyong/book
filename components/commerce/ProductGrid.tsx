"use client";

import { Lock, MessageCircle, Mic, Image as ImageIcon } from "lucide-react";

const products = [
  {
    id: "p1",
    type: "photoset",
    title: "Exclusive Beach Photoset",
    price: "$9.99",
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?q=80&w=800&auto=format&fit=crop",
    locked: true,
  },
  {
    id: "p2",
    type: "photoset",
    title: "Private Room Selfie Collection",
    price: "$14.99",
    image: "https://images.unsplash.com/photo-1520635360276-79f3dbd809f6?q=80&w=800&auto=format&fit=crop",
    locked: true,
  },
  {
    id: "s1",
    type: "service",
    title: "WeChat / Telegram ID",
    price: "$50.00",
    icon: <MessageCircle className="h-10 w-10 text-green-500" />,
    description: "Get my private contact for chatting.",
  },
  {
    id: "s2",
    type: "service",
    title: "1-Hour Gaming Companion",
    price: "$30.00",
    icon: <Mic className="h-10 w-10 text-purple-500" />,
    description: "Play Valorant/LOL with me usually 8PM-12AM.",
  },
  {
    id: "c1",
    type: "course",
    title: "Instagram Growth Masterclass",
    price: "$49.90",
    icon: <ImageIcon className="h-10 w-10 text-blue-500" />,
    description: "Video Tutorial: How to gain 10k followers in 30 days.",
  },
];

export function ProductGrid() {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Latest Contents & Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {item.type === "photoset" && (
              <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                {item.locked && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <Lock className="h-10 w-10 text-white mb-2" />
                    <span className="text-white font-semibold">Locked</span>
                  </div>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}

            {(item.type === "service") && (
               <div className="relative aspect-[3/4] bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 bg-white p-4 rounded-full shadow-sm">
                    {item.icon}
                  </div>
                  <p className="text-sm text-gray-500">{item.description}</p>
               </div>
            )}

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-pink-600">
                  {item.price}
                </span>
                <button 
                  onClick={() => alert(`Buy ${item.title}`)}
                  className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
