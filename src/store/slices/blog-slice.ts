import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {
  Post,
  PostCreateInput,
  PostUpdateInput,
  PostFilters,
  PostSortBy,
  PostPaginatedResult,
  PostComment,
  PostCommentCreateInput,
} from '@/models/post';

interface BlogState {
  posts: Post[];
  currentPost: Post | null;
  relatedPosts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
  filters: PostFilters;
  sortBy: PostSortBy;
  sortOrder: 'asc' | 'desc';
}

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  relatedPosts: [],
  pagination: {
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
  filters: {},
  sortBy: PostSortBy.publishedAt,
  sortOrder: 'desc',
};

// Async thunks
export const fetchPosts = createAsyncThunk(
  'blog/fetchPosts',
  async (
    {
      filters,
      page = 1,
      limit = 9,
    }: {
      filters?: PostFilters;
      page?: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      // For now, return mock data - replace with actual API call later
      const queryParams = new URLSearchParams();

      // Add pagination parameters
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());

      // Add filters to query parameters
      if (filters) {
        // Category filter
        if (filters.categoryId) {
          queryParams.append('categoryId', filters.categoryId);
        }

        // Search query filter
        if (filters.searchQuery) {
          queryParams.append('q', filters.searchQuery);
        }

        // Tags filter
        if (filters.tags && filters.tags.length > 0) {
          filters.tags.forEach((tag) => {
            queryParams.append('tags', tag);
          });
        }
      }
      const response = await fetch(`/api/blog?${queryParams}`);
      const data: PostPaginatedResult = await response.json();
      return (
        data || {
          posts: [],
          pagination: {
            page: 1,
            limit: 9,
            total: 0,
            totalPages: 0,
          },
        }
      );
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPostBySlug = createAsyncThunk(
  'blog/fetchPostBySlug',
  async ({ slug }: { slug: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/blog/slug/${slug}`);
      const data: Post = await response.json();
      return data || {};
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRelatedPosts = createAsyncThunk(
  'blog/fetchRelatedPosts',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/blog/slug/${slug}/related`);

      if (!response.ok) {
        throw new Error('Failed to fetch related posts');
      }

      const data: Post[] = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'blog/createPost',
  async (postData: PostCreateInput, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data: Post = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async (
    { id, postData }: { id: string; postData: PostUpdateInput },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      const data: Post = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'blog/deletePost',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const incrementPostViews = createAsyncThunk(
  'blog/incrementPostViews',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/blog/${postId}/views`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to increment views');
      }

      const data = await response.json();
      return { postId, views: data.views };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const togglePostLike = createAsyncThunk(
  'blog/togglePostLike',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/blog/${postId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();
      return { postId, likes: data.likes, isLiked: data.isLiked };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Blog Slice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setCurrentPost: (state, action: PayloadAction<Post | null>) => {
      state.currentPost = action.payload;
    },
    setFilters: (state, action: PayloadAction<PostFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSortBy: (state, action: PayloadAction<BlogState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<BlogState['sortOrder']>) => {
      state.sortOrder = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetBlogState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch Posts
    builder.addCase(fetchPosts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.isLoading = false;      
      const sortedPosts = [...action.payload.posts].sort((a, b) => {
        let aValue: any, bValue: any;

        if (state.sortBy === 'stats.views') {
          aValue = a.stats.views;
          bValue = b.stats.views;
        } else if (state.sortBy === 'stats.likes') {
          aValue = a.stats.likes;
          bValue = b.stats.likes;
        } else {
          aValue = a[state.sortBy as keyof Post];
          bValue = b[state.sortBy as keyof Post];
        }

        if (state.sortOrder === 'asc') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
      
      state.posts = sortedPosts;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Post by Slug
    builder.addCase(fetchPostBySlug.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPostBySlug.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentPost = action.payload;
    });
    builder.addCase(fetchPostBySlug.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Related Posts
    builder.addCase(fetchRelatedPosts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchRelatedPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.relatedPosts = action.payload;
    });
    builder.addCase(fetchRelatedPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Post
    builder.addCase(createPost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts.unshift(action.payload);
      state.pagination.total += 1;
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Post
    builder.addCase(updatePost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updatePost.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.posts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
      if (state.currentPost?.id === action.payload.id) {
        state.currentPost = action.payload;
      }
    });
    builder.addCase(updatePost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete Post
    builder.addCase(deletePost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = state.posts.filter((post) => post.id !== action.payload);
      state.pagination.total -= 1;
      if (state.currentPost?.id === action.payload) {
        state.currentPost = null;
      }
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Increment Post Views
    builder.addCase(incrementPostViews.fulfilled, (state, action) => {
      const { postId, views } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.stats.views = views;
      }
      if (state.currentPost?.id === postId) {
        state.currentPost.stats.views = views;
      }
    });

    // Toggle Post Like
    builder.addCase(togglePostLike.fulfilled, (state, action) => {
      const { postId, likes } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.stats.likes = likes;
      }
      if (state.currentPost?.id === postId) {
        state.currentPost.stats.likes = likes;
      }
    });

    // Fetch Comments
    builder.addCase(fetchComments.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.currentPost && state.currentPost.id === action.payload.postId) {
        state.currentPost.comments = action.payload.comments;
      }
    });
    builder.addCase(fetchComments.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Add Comment
    builder.addCase(addComment.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addComment.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.currentPost && state.currentPost.id === action.payload.postId) {
        if (!state.currentPost.comments) state.currentPost.comments = [];
        state.currentPost.comments.push(action.payload.comment);
        if (state.currentPost.stats) {
          state.currentPost.stats.commentCount += 1;
        }
      }
    });
    builder.addCase(addComment.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setCurrentPost,
  setFilters,
  clearFilters,
  setSortBy,
  setSortOrder,
  setCurrentPage,
  setLimit,
  clearError,
  resetBlogState,
} = blogSlice.actions;

export default blogSlice.reducer;

export const fetchComments = createAsyncThunk(
  'blog/fetchComments',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/blog/${postId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data: PostComment[] = await response.json();
      return { postId, comments: data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'blog/addComment',
  async (
    { postId, input }: { postId: string; input: PostCommentCreateInput },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`/api/blog/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to add comment');
      }
      const data: PostComment = await response.json();
      return { postId, comment: data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
