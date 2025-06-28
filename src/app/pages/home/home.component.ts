import { Component, OnInit } from '@angular/core';
import { BlogService, Blog } from '../../services/blog';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  blogs: Blog[] = [];
  loading = true;
  error = '';

  selectedFilter: string = 'Latest';
  showTopFilters: boolean = false;

  currentYear: number = new Date().getFullYear();




  constructor(private blogService: BlogService, public router: Router) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = '';

    this.blogService.getAll().subscribe({
      next: (data) => {
        this.blogs = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load blogs';
        this.loading = false;
      }
    });
  }

  

  setFilter(type: string): void {
    this.selectedFilter = type;

    if (type === 'Latest') {
      this.showTopFilters = false;
    } else {
      this.showTopFilters = true;
    }

    this.loadBlogs();
  }

  toggleTopFilters(): void {
    if (this.showTopFilters) {
      this.showTopFilters = false;
      this.selectedFilter = 'Latest';
    } else {
      this.showTopFilters = true;
      this.selectedFilter = '';
    }

    this.loadBlogs();
  }

  calculateReadTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = text?.trim()?.split(/\s+/)?.length || 0;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  goToDetail(blogId: string): void {
    this.router.navigate(['/blog', blogId]);
  }

getAuthorName(blog: Blog): string {
  const author = blog.author as any;

  if (author && typeof author === 'object') {
    return `${author.firstName || 'Unknown'}`.trim();
  }

  // If author is not an object (e.g., just an ObjectId string)
  return 'Unknown';
}


}
