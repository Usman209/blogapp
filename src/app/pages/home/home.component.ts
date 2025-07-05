import { Component, HostListener, OnInit } from '@angular/core';
import { BlogService, Blog } from '../../services/blog';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule,HighlightDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  blogs: Blog[] = [];
  loading = false;
  error = '';
  page = 1;
  pageSize = 10;
  hasMore = true;

  selectedFilter: string = 'Latest';
  showTopFilters: boolean = false;
  currentYear: number = new Date().getFullYear();

  constructor(private blogService: BlogService, public router: Router) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

loadBlogs(): void {
  if (this.loading || !this.hasMore) return;

  this.loading = true;

  this.blogService.getAll(this.page, this.pageSize).subscribe({
    next: (data) => {
  this.blogs = [...this.blogs, ...data]; // ✅ now correct
  this.loading = false;

  if (data.length < this.pageSize) {
  this.hasMore = false;
}


  if (data.length < this.pageSize) this.hasMore = false;
  else this.page++;
},

    error: () => {
      this.error = 'Failed to load blogs';
      this.loading = false;
    }
  });
}



  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.body.offsetHeight;
    if (scrollPosition >= documentHeight - 200) {
      this.loadBlogs();
    }
  }

  setFilter(type: string): void {
    this.selectedFilter = type;
    this.showTopFilters = type !== 'Latest';
    this.resetAndLoadBlogs();
  }

  toggleTopFilters(): void {
    this.showTopFilters = !this.showTopFilters;
    this.selectedFilter = this.showTopFilters ? '' : 'Latest';
    this.resetAndLoadBlogs();
  }

  resetAndLoadBlogs(): void {
    this.blogs = [];
    this.page = 1;
    this.hasMore = true;
    this.loadBlogs();
  }

  goToDetail(blogId: string): void {
    this.router.navigate(['/blog', blogId]);
  }

  calculateReadTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = text?.trim()?.split(/\s+/)?.length || 0;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  getAuthorName(blog: Blog): string {
    const author = blog.author as any;
    return author && typeof author === 'object' ? author.firstName || 'Unknown' : 'Unknown';
  }
}
