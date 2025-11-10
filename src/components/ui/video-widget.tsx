"use client"

import Image from "next/image"
import { PlayIcon } from "lucide-react"
import { cn } from "@/lib/utils"

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

export function VideoWidget({
  url,
  alt,
  className,
  onClick,
}: {
  url: string
  alt?: string
  className?: string
  onClick?: () => void
}) {
  const ytId = getYouTubeId(url)
  const thumbnailSrc = ytId
    ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    : "/images/placeholder.svg"

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full h-full overflow-hidden rounded-lg group",
        className
      )}
    >
      <Image
        src={thumbnailSrc}
        alt={alt || "Video"}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        unoptimized={Boolean(ytId)}
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="bg-white/90 text-black rounded-full p-3 shadow-md group-hover:scale-105 transition-transform">
          <PlayIcon className="size-6" />
        </span>
      </div>
    </button>
  )
}