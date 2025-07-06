import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogService, Blog } from '../../services/blog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blog = signal<Blog | null>(null);
  loading = true;
  error = '';
  userId = '';
  newComment: string = '';
  postingComment = false;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (!blogId) {
      this.error = 'Invalid blog ID.';
      this.loading = false;
      return;
    }

    if (typeof window !== 'undefined') {
      const rawUser = localStorage.getItem('user');
      const user = JSON.parse(rawUser || 'null');
      this.userId = user?.id || '';
    }

    this.fetchBlog(blogId);
  }

  fetchBlog(blogId: string): void {
    this.loading = true;
    this.blogService.getById(blogId).subscribe({
      next: (data) => {
        this.blog.set(data);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load blog.';
        this.loading = false;
      }
    });
  }

  likeBlog(): void {
    if (!this.userId) {
      alert('You must be logged in to like this blog.');
      return;
    }

    const id = this.blog()?.['_id'];
    if (!id) return;

    this.blogService.likeBlog(id).subscribe({
      next: (updated) => this.blog.set(updated)
    });
  }

  dislikeBlog(): void {
    if (!this.userId) {
      alert('You must be logged in to dislike this blog.');
      return;
    }

    const id = this.blog()?.['_id'];
    if (!id) return;

    this.blogService.dislikeBlog(id).subscribe({
      next: (updated) => this.blog.set(updated)
    });
  }

  hasLiked(): boolean {
    return this.blog()?.reactions?.likes?.includes(this.userId) || false;
  }

  hasDisliked(): boolean {
    return this.blog()?.reactions?.dislikes?.includes(this.userId) || false;
  }

  likeCount(): number {
    return this.blog()?.reactions?.likes?.length || 0;
  }

  dislikeCount(): number {
    return this.blog()?.reactions?.dislikes?.length || 0;
  }

  postComment(): void {
    const blogId = this.blog()?.['_id'];
    if (!this.newComment.trim() || !blogId || !this.userId) return;

    this.postingComment = true;

    this.blogService.addComment(blogId, this.newComment).subscribe({
      next: (newComment) => {
        const current = this.blog();
        if (current) {
          this.blog.set({
            ...current,
            comments: [...(current.comments || []), newComment] // ✅ append new comment
          });
        }

        this.newComment = '';
        this.postingComment = false;
      },
      error: () => {
        alert('Failed to post comment');
        this.postingComment = false;
      }
    });
  }
}
