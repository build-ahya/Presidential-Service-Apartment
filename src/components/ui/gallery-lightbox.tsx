"use client"

import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

type MediaItem = {
  url: string
  alt: string
  type: "image" | "video"
  caption?: string
}

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes("youtube.com") || u.hostname.includes("m.youtube.com")) {
      const v = u.searchParams.get("v")
      if (v) return v
      const shorts = u.pathname.match(/^\/shorts\/([A-Za-z0-9_-]+)/)
      if (shorts && shorts[1]) return shorts[1]
      const embed = u.pathname.match(/^\/embed\/([A-Za-z0-9_-]+)/)
      if (embed && embed[1]) return embed[1]
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "")
      return id || null
    }
    return null
  } catch {
    return null
  }
}

export function GalleryLightbox({
  items,
  open,
  index,
  onOpenChange,
  onPrev,
  onNext,
}: {
  items: MediaItem[]
  open: boolean
  index: number | null
  onOpenChange: (open: boolean) => void
  onPrev: () => void
  onNext: () => void
}) {
  return (
    items.length > 0 && (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-black/90 border-none p-0 w-[95vw] max-w-6xl">
          {index !== null && (
            <div className="relative w-full">
              <div className="relative w-full h-[80vh] flex items-center justify-center bg-black">
                {(() => {
                  const media = items[index]
                  const ytId = media.type === "video" ? getYouTubeId(media.url) : null
                  if (media.type === "image") {
                    return (
                      <Image
                        src={media.url}
                        alt={media.alt || media.caption || "Photo"}
                        fill
                        className="object-contain"
                        sizes="100vw"
                      />
                    )
                  }
                  if (ytId) {
                    return (
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                        title={media.alt || media.caption || "YouTube video"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    )
                  }
                  return (
                    <video className="w-full h-full" src={media.url} controls autoPlay />
                  )
                })()}
              </div>
              {items.length > 1 && (
                <>
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <button
                      type="button"
                      onClick={onPrev}
                      className="m-4 rounded-full bg-white/90 text-black px-2 py-2 shadow hover:bg-white"
                    >
                      <ChevronLeftIcon className="size-6" />
                    </button>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button
                      type="button"
                      onClick={onNext}
                      className="m-4 rounded-full bg-white/90 text-black px-2 py-2 shadow hover:bg-white"
                    >
                      <ChevronRightIcon className="size-6" />
                    </button>
                  </div>
                </>
              )}
              {(() => {
                const media = items[index]
                return media.caption ? (
                  <div className="text-white/90 text-sm p-4">{media.caption}</div>
                ) : null
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
  )
}