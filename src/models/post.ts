import { Media } from "./media";
import { Pagination } from "./settings";

export interface PostAuthor {
id: string;
    name: string;
    avatar?: string;
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface PostTag {
  id: string;
  name: string;
  slug?: string;
}

export interface PostMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface PostStats {
  views: number;
  likes: number;
  shares: number;
  readingTime: number; // in minutes
  commentCount: number;
}

export interface PostComment {
  id: string;
  content: string;
  author: PostAuthor;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  parentId?: string; // for nested comments
  isEdited: boolean;
}

export type PostCommentCreateInput = {
  content: string;
  parentId?: string;
};

export type PostCommentUpdateInput = Partial<Pick<PostComment, 'content' | 'likes' | 'isEdited' | 'parentId'>> & {
  updatedAt?: string;
};

export interface Post {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  content: string;
  excerpt: string;
  author: PostAuthor;
  category: PostCategory;
  tags: PostTag[];
  featuredMedia: Media;
  gallery?: Media[];
  meta: PostMeta;
  stats: PostStats;
  comments?: PostComment[];

  // Status and visibility
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  visibility: 'public' | 'private' | 'password-protected';
  password?: string;

  // Dates
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  scheduledAt?: string;

  // Additional features
  isPromoted: boolean;
  isFeatured: boolean;
  isPremium: boolean;
  allowComments: boolean;

  // Related content
  relatedPosts?: string[]; // Array of post IDs
  // Version control
  version: number;
  lastModifiedBy: string;
}

export interface PostFilters {
  categoryId?: string;
  searchQuery?: string;
  tags?: string[];
}

export interface PostPaginatedResult {
  posts: Post[];
  pagination: Pagination;
}

export enum PostSortBy {
  createdAt = 'createdAt',
  publishedAt = 'publishedAt',
  updatedAt = 'updatedAt',
  views = 'stats.views',
  likes = 'stats.likes',
}
export type PostCreateInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;
export type PostUpdateInput = Partial<PostCreateInput>;