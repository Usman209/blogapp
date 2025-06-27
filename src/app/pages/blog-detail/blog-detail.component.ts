import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogService, Blog } from '../../services/blog';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
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
          this.blog = data;
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
}
