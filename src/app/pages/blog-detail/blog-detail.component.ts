import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogService, Blog } from '../../services/blog';
import { signal, computed } from '@angular/core'; // ✅ Add this


@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blog = signal<Blog | null>(null);     // ✅ use signal
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id');

    if (blogId) {
      this.blogService.getById(blogId).subscribe({
        next: (data) => {
          this.blog.set(data); // ✅ set signal value
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load blog.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Invalid blog ID.';
      this.loading = false;
    }
  }

  likeBlog() {
    const id = this.blog()?.['_id'];
    if (!id) return;

    this.blogService.likeBlog(id).subscribe({
      next: (updated) => this.blog.set(updated), // update UI
    });
  }

  dislikeBlog() {
    const id = this.blog()?.['_id'];
    if (!id) return;

    this.blogService.dislikeBlog(id).subscribe({
      next: (updated) => this.blog.set(updated), // update UI
    });
  }
}

