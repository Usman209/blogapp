import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog';
import { BlogDetailStore } from '../../stores/blog-detail.store';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  store = inject(BlogDetailStore);
  blogService = inject(BlogService);
  route = inject(ActivatedRoute);
  
  newComment = '';
  postingComment = false;
  userId = '';

  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (!blogId) {
      this.store.setError('Invalid blog ID.');
      return;
    }

    const rawUser = localStorage.getItem('user');
    const user = JSON.parse(rawUser || 'null');
    this.userId = user?.id || '';

    this.store.setLoading(true);
    this.blogService.getById(blogId).subscribe({
      next: (data) => this.store.setBlog(data),
      error: () => this.store.setError('Failed to load blog.'),
    });
  }

  postComment(): void {
    const blog = this.store.blog();
    if (!this.newComment.trim() || !blog?._id || !this.userId) return;

    this.postingComment = true;
    this.blogService.addComment(blog._id, this.newComment).subscribe({
      next: (comment) => {
        this.store.appendComment(comment);
        this.newComment = '';
        this.postingComment = false;
      },
      error: () => {
        alert('Failed to post comment');
        this.postingComment = false;
      },
    });
  }

  likeBlog(): void {
    const blog = this.store.blog();
    if (!this.userId || !blog?._id) return;

    this.blogService.likeBlog(blog._id).subscribe({
      next: (updated) => this.store.setBlog(updated),
    });
  }

  dislikeBlog(): void {
    const blog = this.store.blog();
    if (!this.userId || !blog?._id) return;

    this.blogService.dislikeBlog(blog._id).subscribe({
      next: (updated) => this.store.setBlog(updated),
    });
  }

  hasLiked(): boolean {
    return this.store.blog()?.reactions?.likes?.includes(this.userId) || false;
  }

  hasDisliked(): boolean {
    return this.store.blog()?.reactions?.dislikes?.includes(this.userId) || false;
  }

  likeCount(): number {
    return this.store.blog()?.reactions?.likes?.length || 0;
  }

  dislikeCount(): number {
    return this.store.blog()?.reactions?.dislikes?.length || 0;
  }

  displayedComments(): any[] {
    const blog = this.store.blog();
    const end = this.store.currentPage() * this.store.commentsPerPage();
    return blog?.comments?.slice(0, end) || [];
  }

  totalComments(): number {
    return this.store.blog()?.comments?.length ?? 0;
  }
}