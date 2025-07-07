import { Injectable } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals'; // ✅ Added patchState import
import { Blog } from '../services/blog';

export interface BlogDetailState {
  blog: Blog | null;
  loading: boolean;
  error: string;
  currentPage: number;
  commentsPerPage: number;
}

const initialState: BlogDetailState = {
  blog: null,
  loading: false,
  error: '',
  currentPage: 1,
  commentsPerPage: 10,
};

export const BlogDetailStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setBlog(blog: Blog) {
      patchState(store, { blog, currentPage: 1, loading: false });
    },
    setLoading(loading: boolean) {
      patchState(store, { loading });
    },
    setError(error: string) {
      patchState(store, { error, loading: false });
    },
    loadMoreComments() {
      patchState(store, { currentPage: store.currentPage() + 1 });
    },
    appendComment(comment: any) {
      const blog = store.blog();
      if (!blog) return;
      patchState(store, {
        blog: {
          ...blog,
          comments: [...(blog.comments || []), comment],
        },
      });
    },
  }))
);