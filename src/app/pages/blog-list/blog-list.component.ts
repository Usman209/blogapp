import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService, Blog } from '../../services/blog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  loading = false;
  error: string = '';
  page = 1;
  pageSize = 10;
  totalPages = 1;
  totalBlogs = 0;

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;

    this.blogService.getAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.blogs = data.blogs;
        this.totalBlogs = data.total;
        this.totalPages = Math.ceil(this.totalBlogs / this.pageSize);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load blogs';
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadBlogs();
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadBlogs();
    }
  }

  goToCreate(): void {
    this.router.navigate(['/editor']);
  }

  editBlog(id: string): void {
    this.router.navigate(['/admin/blogs', id, 'edit']);
  }

  deleteBlog(id: string): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.delete(id).subscribe(() => {
        this.blogs = this.blogs.filter((b) => b._id !== id);
        this.totalBlogs--;
        this.totalPages = Math.ceil(this.totalBlogs / this.pageSize);

        // Optional: Load next page if the current one becomes empty
        if (this.blogs.length === 0 && this.page > 1) {
          this.page--;
          this.loadBlogs();
        }
      });
    }
  }
}
