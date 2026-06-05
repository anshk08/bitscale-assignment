"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

const posts = [
  {
    title: "How to Integrate 2 Way HubSpot",
    excerpt:
      "Prerequisites for this Integration is that you should have a HubSpot account and copy the API key. We simply add our API key through the integrations panel, authorize the connection, map your contact fields, and set up the two-way sync rules so every update in HubSpot reflects instantly in Bitscale and vice versa. No manual exports, no stale data — everything flows automatically the moment a record changes on either side.",
    postedAt: "Posted today",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail:
      "https://d26oc3sg82pgk3.cloudfront.net/files/media/edit/image/52953/article_full%402x.jpg",
  },
  {
    title: "Automate LinkedIn Outreach at Scale",
    excerpt:
      "Learn how to connect Bitscale with LinkedIn to run fully personalized outreach campaigns without lifting a finger. Set enrollment triggers based on job title, company size, or recent activity. Craft dynamic message templates with GPT-powered personalization tokens, and let the engine handle follow-ups, connection requests, and reply detection automatically across hundreds of prospects per day.",
    postedAt: "Posted 2 days ago",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail:
      "https://d26oc3sg82pgk3.cloudfront.net/files/media/edit/image/52953/article_full%402x.jpg",
  },
  {
    title: "Enrich Leads with Clearbit & GPT-4",
    excerpt:
      "Combine Clearbit enrichment with GPT-4 lead scoring to qualify inbound leads automatically the moment they hit your CRM. Pull firmographic data, technographic signals, and funding history, then score each lead against your ideal customer profile. This workflow cuts manual research time by over 80% for most sales teams and ensures your reps only touch the accounts worth pursuing.",
    postedAt: "Posted 4 days ago",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail:
      "https://d26oc3sg82pgk3.cloudfront.net/files/media/edit/image/52953/article_full%402x.jpg",
  },
  {
    title: "Build a Cold Email Engine in 10 Minutes",
    excerpt:
      "Walk through building a fully automated cold email engine using Bitscale, Apollo, and your CRM of choice. No code required — just connect your data sources, configure your audience filters, write your sequence templates, and launch. The engine handles personalization, sending windows, bounce handling, and reply routing so your team wakes up to booked meetings instead of empty inboxes.",
    postedAt: "Posted 1 week ago",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail:
      "https://d26oc3sg82pgk3.cloudfront.net/files/media/edit/image/52953/article_full%402x.jpg",
  },
];

const AUTOPLAY_INTERVAL = 5000;

function getYouTubeEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const videoId =
      parsed.searchParams.get("v") || parsed.pathname.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } catch {
    return url;
  }
}

export function Latest() {
  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [fading, setFading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<
    (typeof posts)[number] | null
  >(null);

  const goTo = useCallback(
    (index: number) => {
      if (index === active) return;
      setFading(true);
      setTimeout(() => {
        setDisplayed(index);
        setActive(index);
        setFading(false);
      }, 200);
    },
    [active],
  );

  useEffect(() => {
    const id = setInterval(() => {
      goTo((active + 1) % posts.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [active, goTo]);

  const post = posts[displayed];

  return (
    <>
      <div className="bg-blue-50 border border-slate-200 h-40 w-full rounded-2xl flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <p className="text-blue-900/60 text-sm font-semibold tracking-tight">
            Latest from Bitscale
          </p>

          <div className="flex items-center gap-1.5">
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === active ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "9999px",
                  backgroundColor: i === active ? "#3b82f6" : "#bfdbfe",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition:
                    "width 400ms cubic-bezier(0.4,0,0.2,1), background-color 400ms ease",
                }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => setSelectedPost(post)}
          style={{
            opacity: fading ? 0 : 1,
            transform: fading ? "translateY(4px)" : "translateY(0px)",
            transition: "opacity 200ms ease, transform 200ms ease",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
          }}
          className="flex gap-3 items-start group"
        >
          <div className="relative shrink-0 w-30 h-19.5 rounded-xl overflow-hidden">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
            />

            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center transition-transform group-hover:scale-110">
                <svg
                  className="w-3.5 h-3.5 text-slate-500 ml-0.5"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M4 2.5l9 5.5-9 5.5V2.5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
              {post.title}
            </p>

            <p
              className="text-xs text-slate-500 leading-relaxed cursor-default"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {post.excerpt}
            </p>

            <p className="text-[11px] text-slate-400 mt-0.5">{post.postedAt}</p>
          </div>
        </button>
      </div>
      <Dialog
        open={!!selectedPost}
        onOpenChange={(open) => !open && setSelectedPost(null)}
      >
        <DialogContent className=" overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-2">
            <DialogHeader>
              <DialogTitle>{selectedPost?.title}</DialogTitle>
            </DialogHeader>
            <p className="text-xs text-muted-foreground">
              {selectedPost?.postedAt}
            </p>
            <p className="text-sm leading-relaxed">{selectedPost?.excerpt}</p>
          </div>
          <div className="flex flex-col">
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              {selectedPost && (
                <iframe
                  src={getYouTubeEmbedUrl(selectedPost.videoUrl)}
                  title={selectedPost.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: "none" }}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
