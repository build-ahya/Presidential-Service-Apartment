'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Post } from '@/models/post';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRelatedPosts, fetchComments, addComment } from '@/store/slices/blog-slice';

export default function BlogDetailsPage({ post }: { post: Post }) {
  const dispatch = useAppDispatch();
  const { relatedPosts, isLoading } = useAppSelector((s) => s.blog);

  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchRelatedPosts(post.slug));
    dispatch(fetchComments(post.id));
  }, [dispatch, post.slug, post.id]);

  const publishedOn = useMemo(() => {
    const dateStr = post.publishedAt || post.createdAt;
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  }, [post.publishedAt, post.createdAt]);

  const onAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = commentText.trim();
    if (!content) return;
    setSubmitting(true);
    try {
      await dispatch(addComment({ postId: post.id, input: { content } })).unwrap();
      setCommentText('');
    } catch (err) {
      // If unauthorized or other error, surface minimal feedback
      console.error(err);
      alert(typeof err === 'string' ? err : 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-8 space-y-8 my-20">
      {/* Hero */}
      {post.featuredMedia?.url && (
        <div className="relative mx-auto container h-64 md:h-96 rounded-xl overflow-hidden border">
          <Image
            src={post.featuredMedia.url}
            alt={post.featuredMedia.alt || post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
          {/* Breadcrumb overlay */}
          <div className="absolute top-4 left-6 right-6">
            <Breadcrumb>
              <BreadcrumbList className="text-white/85">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/blog">Blog</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-primary">{post.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="absolute bottom-4 left-6 right-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="text-white/90 mt-1">{post.subtitle}</p>
            )}
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-10">
        {/* Meta */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <span>By {post.author?.name || 'Admin'}</span>
            {post.category?.name && <span>• {post.category.name}</span>}
            <span>• {publishedOn}</span>
            {post.stats?.readingTime ? (
              <span>• {post.stats.readingTime} min read</span>
            ) : null}
          </div>
          <div className="text-sm text-neutral-600">
            <span>{post.stats?.views ?? 0} views</span>
            <span className="ml-2">{post.stats?.likes ?? 0} likes</span>
            <span className="ml-2">{post.stats?.commentCount ?? 0} comments</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((t) => (
              <Badge key={t.id} variant="secondary">{t.name}</Badge>
            ))}
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Overview</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-700">{post.excerpt}</p>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Article</CardTitle>
            <CardDescription>Read</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </CardContent>
        </Card>

        {/* Related posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Related Posts</CardTitle>
              <CardDescription>You might also like</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => (
                  <Card key={rp.id} className="overflow-hidden">
                    {rp.featuredMedia?.url && (
                      <div className="relative w-full h-36">
                        <Image
                          src={rp.featuredMedia.url}
                          alt={rp.featuredMedia.alt || rp.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">
                        <Link href={`/blog/${rp.slug}`} className="hover:underline">
                          {rp.title}
                        </Link>
                      </CardTitle>
                      {rp.subtitle && (
                        <CardDescription className="line-clamp-2">{rp.subtitle}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <div className="text-xs text-neutral-500">
                        <span>{rp.stats?.views ?? 0} views</span>
                        <span className="ml-2">{rp.stats?.likes ?? 0} likes</span>
                      </div>
                      <Button asChild variant="outline">
                        <Link href={`/blog/${rp.slug}`}>Read</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
            <CardDescription>Join the discussion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comment form */}
            {post.allowComments !== false ? (
              <form onSubmit={onAddComment} className="space-y-3">
                <Textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.currentTarget.value)}
                />
                <div className="flex items-center justify-end gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-neutral-600">Comments are disabled for this post.</p>
            )}

            {/* Existing comments */}
            {Array.isArray(post.comments) && post.comments.length > 0 ? (
              <div className="space-y-4">
                {post.comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    {c.author?.avatar && (
                      <Image
                        src={c.author.avatar}
                        alt={c.author.name || 'User'}
                        width={36}
                        height={36}
                        className="rounded-full border"
                      />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{c.author?.name || 'User'}</div>
                      <div className="text-xs text-neutral-500 mb-1">
                        {new Date(c.createdAt).toLocaleString()}
                      </div>
                      <p className="text-sm text-neutral-800 whitespace-pre-line">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-600">No comments yet.</p>
            )}

            <div className="pt-4">
              <Button asChild variant="outline">
                <Link href="/blog">Back to blog</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
