import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface Comment {
  _id: string;
  blog: string;
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  body: string;
  tags?: string[];
  author?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdBy?: string;
  updatedBy?: string;
  reactions?: {
    likes: string[];
    dislikes: string[];
  };
  views?: number;
  comments?: Comment[];
  likesCount?: number;       // ✅ added
  dislikesCount?: number;    // ✅ optional
  commentsCount?: number;    // ✅ added
  createdAt?: string;
  updatedAt?: string;
}


export interface BlogResponse {
  blogs: Blog[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:4000/api/blog';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private getAuthHeaders(): HttpHeaders | undefined {
    if (!this.isBrowser) return undefined;
    const token = localStorage.getItem('auth_token');
    return token ? new HttpHeaders({ 'auth-token': token }) : undefined;
  }

  getAll(page = 1, limit = 10, forcePublic = false): Observable<BlogResponse> {
    const headers = this.getAuthHeaders();
    const url = forcePublic || !headers
      ? `${this.apiUrl}/public?page=${page}&limit=${limit}`
      : `${this.apiUrl}?page=${page}&limit=${limit}`;

    return this.http
      .get<{ code: number; message: string; body: Blog[] | BlogResponse }>(url, {
        headers: !forcePublic ? headers : undefined
      })
      .pipe(
        map((res) => {
          if (Array.isArray(res.body)) {
            return { blogs: res.body, total: res.body.length };
          }
          return res.body as BlogResponse;
        })
      );
  }

  getById(id: string): Observable<Blog> {
    const headers = this.getAuthHeaders();
    const url = headers ? `${this.apiUrl}/${id}` : `${this.apiUrl}/public/${id}`;

    return this.http.get<{ code: number; message: string; body: Blog }>(url, {
      headers: headers || undefined
    }).pipe(map(res => res.body));
  }

  likeBlog(id: string): Observable<Blog> {
    return this.http.patch<{ code: number; message: string; body: Blog }>(
      `${this.apiUrl}/${id}/like`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(map(res => res.body));
  }

  dislikeBlog(id: string): Observable<Blog> {
    return this.http.patch<{ code: number; message: string; body: Blog }>(
      `${this.apiUrl}/${id}/dislike`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(map(res => res.body));
  }

  create(data: Partial<Blog>): Observable<Blog> {
    return this.http.post<{ code: number; message: string; body: Blog }>(
      this.apiUrl,
      data,
      { headers: this.getAuthHeaders() }
    ).pipe(map(res => res.body));
  }

  update(id: string, data: Partial<Blog>): Observable<Blog> {
    return this.http.put<{ code: number; message: string; body: Blog }>(
      `${this.apiUrl}/${id}`,
      data,
      { headers: this.getAuthHeaders() }
    ).pipe(map(res => res.body));
  }

  delete(id: string): Observable<{ code: number; message: string }> {
    return this.http.delete<{ code: number; message: string }>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * 💬 Add new comment (returns just the comment)
   */
  addComment(blogId: string, content: string): Observable<Comment> {
    return this.http.post<{ code: number; message: string; body: Comment }>(
      `http://localhost:4000/api/comment`,
      { blog: blogId, content },
      { headers: this.getAuthHeaders() }
    ).pipe(map(res => res.body));
  }
}
