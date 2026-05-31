"use client";

import { useEffect, useRef, useState } from "react";
import { Post } from "@/types/post";
import { Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ImageViewerProps {
  images: string[];
  title: string;
  nextPosts?: Post[];
  locale?: string;
  isPaid?: boolean; // New prop to control paywall
}

export default function ImageViewer({ 
  images, 
  title, 
  nextPosts = [], 
  locale = 'zh',
  isPaid = false // Default to locked for testing
}: ImageViewerProps) {
  const [activeTitle, setActiveTitle] = useState(title);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const newSlug = entry.target.getAttribute('data-slug');
          const newTitle = entry.target.getAttribute('data-title');
          if (newSlug && window.location.pathname !== `/${locale}/gallery/${newSlug}`) {
            window.history.pushState({}, '', `/${locale}/gallery/${newSlug}`);
            if (newTitle) setActiveTitle(newTitle);
          }
        }
      });
    }, { threshold: 0.2 });

    const sections = document.querySelectorAll('.gallery-section');
    sections.forEach(section => observerRef.current?.observe(section));

    return () => observerRef.current?.disconnect();
  }, [nextPosts, locale]);

  return (
    <div className="space-y-12">
      {/* Current Post Section */}
      <div className="gallery-section space-y-4" data-title={title}>
        {images.map((src: string, index: number) => {
          // Backend returns "LOCKED" for protected images. 
          // We also enforce client-side limit for immediate feedback if data hasn't refreshed.
          const isBackendLocked = src === "LOCKED";
          const isClientLocked = !isPaid && index >= 5;
          const isLocked = isBackendLocked || isClientLocked;

          return (
            <div key={`${title}-${index}`} className="w-full relative min-h-[400px] bg-muted/10 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              {!isBackendLocked ? (
                <img 
                  src={src} 
                  alt={`${title} - ${index + 1}`} 
                  className={`w-full h-auto object-contain mx-auto display-block transition-all duration-500 ${isLocked ? 'blur-2xl scale-105 pointer-events-none select-none' : ''}`}
                  loading={index < 3 ? "eager" : "lazy"}
                  onContextMenu={(e) => isLocked && e.preventDefault()}
                />
              ) : (
                // Placeholder for backend-locked images (no real URL available)
                <div className="w-full h-[600px] bg-muted/20 flex items-center justify-center blur-3xl">
                   <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 opacity-50" />
                </div>
              )}
              
              {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10 p-4 text-center">
                  <div className="bg-background/95 p-8 rounded-2xl shadow-2xl max-w-sm w-full space-y-4 border border-border/50">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Unlock Full Gallery</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Get access to {images.length - 5} more high-quality photos in this series.
                      </p>
                    </div>
                    <Button asChild size="lg" className="w-full font-bold">
                      <Link href={`/${locale}/pricing`}>
                        Unlock Now
                      </Link>
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Already a member? <Link href={`/${locale}/auth/signin`} className="underline hover:text-primary">Sign in</Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Next Posts (Recursive/Continuous) */}
      {nextPosts.map((post) => (
        <div 
          key={post.uuid} 
          className="gallery-section space-y-4 pt-20 border-t border-dashed"
          data-slug={post.slug || post.uuid}
          data-title={post.title}
        >
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold opacity-50 mb-2">Continue Reading...</h2>
            <h3 className="text-xl font-medium">{post.title}</h3>
          </div>
          {post.images?.map((src: string, index: number) => (
            <div key={`${post.uuid}-${index}`} className="w-full relative min-h-[400px] bg-muted/10 rounded-xl overflow-hidden">
              <img 
                src={src} 
                alt={`${post.title} - ${index + 1}`} 
                className="w-full h-auto object-contain mx-auto"
                loading="lazy" 
              />
            </div>
          ))}
          
          <div className="py-12 text-center">
            <a 
              href={`/${locale}/gallery/${post.slug || post.uuid}`}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-transform"
            >
              View Full Gallery & Details
            </a>
          </div>
        </div>
      ))}

      {nextPosts.length > 0 && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground italic">You've reached the end of this influencer's featured series.</p>
          <a 
            href={`/${locale}/u/`}
            className="mt-4 inline-block text-primary hover:underline font-bold"
          >
            ← Explore other Models
          </a>
        </div>
      )}
    </div>
  );
}