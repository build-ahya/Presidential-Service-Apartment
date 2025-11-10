"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

type MediaItem = {
  url: string
  alt?: string
  caption?: string
}

export function MediaCarousel({
  items,
  className,
  heightClass = "h-40",
  autoplay = false,
  delayMs = 3000,
  onOpen,
}: {
  items: MediaItem[]
  className?: string
  heightClass?: string
  autoplay?: boolean
  delayMs?: number
  onOpen?: (index: number) => void
}) {
  const [api, setApi] = React.useState<CarouselApi | null>(null)

  React.useEffect(() => {
    if (!api || !autoplay || items.length <= 1) return
    let cancelled = false
    const interval = setInterval(() => {
      if (cancelled) return
      // Looping scroll
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, Math.max(1000, delayMs))
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [api, autoplay, delayMs, items.length])

  if (!items || items.length === 0) return null

  return (
    <Carousel className={cn("w-full", className)} opts={{ loop: true }} setApi={setApi}>
      <CarouselContent>
        {items.map((m, idx) => (
          <CarouselItem key={idx}>
            <button
              type="button"
              className={cn("relative w-full", heightClass)}
              onClick={() => onOpen?.(idx)}
            
            >
              <Image
                src={m.url}
                alt={m.alt || m.caption || "Image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized={/^https?:/.test(m.url)}
              />
            </button>
          </CarouselItem>
        ))}
      </CarouselContent>
      {items.length > 1 && (
        <>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </>
      )}
    </Carousel>
  )
}