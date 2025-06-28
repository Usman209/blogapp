import { Component } from '@angular/core';
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
export class BlogListComponent {
  blogs: Blog[] = [];
  loading = true;
  error: string = '';

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.blogService.getAll().subscribe({
      next: (data) => {
        console.log(data);
        
        this.blogs = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load blogs';
        this.loading = false;
      }
    });
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
        this.blogs = this.blogs.filter(b => b._id !== id);
      });
    }
  }
}
