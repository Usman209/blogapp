import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { BlogService, Blog } from '../../services/blog';
import { HighlightDirective } from '../../directives/highlight.directive';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HighlightDirective],
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

  isAdminView = false;
  currentUserId: string | null = null;

  constructor(
    private blogService: BlogService,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.detectViewMode();
        this.resetAndLoadBlogs();
      });

    this.detectViewMode();
    this.loadBlogs();
  }

  detectViewMode(): void {
    const path = this.router.url;
    this.isAdminView = path.startsWith('/admin');

    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      this.currentUserId = user?._id || null;
    } else {
      this.currentUserId = null;
    }
  }

  loadBlogs(): void {
    if (this.loading || !this.hasMore) return;

    this.loading = true;

    this.blogService.getAll(this.page, this.pageSize, true).subscribe({
      next: (data) => {
        let result = data.blogs;

        if (this.isAdminView && this.currentUserId) {
          result = result.filter((b: Blog) => {
            const authorId = (b.author as any)?._id || b.createdBy;
            return authorId === this.currentUserId;
          });
        }

        this.blogs = [...this.blogs, ...result];
        this.loading = false;

        if (result.length < this.pageSize) this.hasMore = false;
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
    return author && typeof author === 'object'
      ? `${author.firstName ?? 'Unknown'}`
      : 'Unknown';
  }
}
