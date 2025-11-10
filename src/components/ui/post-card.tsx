"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Post } from "@/models/post"

type PostCardProps = {
  post: Post
  className?: string
}

export function PostCard({ post, className }: PostCardProps) {
  const cover = post.featuredMedia?.url
  const isRemote = cover ? /^https?:/.test(cover) : false
  const alt = post.featuredMedia?.alt || post.title

  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <Card className={className ? className : "overflow-hidden h-full"}>
        <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-xl">
          {cover ? (
            <Image
              src={cover}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={isRemote}
            />
          ) : (
            <div className="bg-neutral-200 w-full h-full" />
          )}
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
          {post.subtitle && (
            <CardDescription className="line-clamp-2">{post.subtitle}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {post.excerpt && (
            <p className="text-sm text-neutral-700 line-clamp-3">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>By {post.author?.name || "Admin"}</span>
            {post.category?.name && <span>• {post.category.name}</span>}
            {post.publishedAt && (
              <span>• {new Date(post.publishedAt).toLocaleDateString()}</span>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 4).map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-neutral-500">
              <span>{post.stats?.views ?? 0} views</span>
              <span className="ml-2">{post.stats?.likes ?? 0} likes</span>
            </div>
            <span className="text-xs text-primary">Read more →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}