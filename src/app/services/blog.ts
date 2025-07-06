import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface Blog {
  _id: string;
  title: string;
  body: string;
  tags?: string[];
  author?: any;
  createdBy?: string;
  updatedBy?: string;
  reactions?: {
    likes: number;
    dislikes: number;
  };
  views?: number;
  comments?: string[];
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

  /**
   * 🔄 Get paginated blogs (secure or public based on token)
   */
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


  /**
   * 👍 Like blog
   */
  likeBlog(id: string): Observable<Blog> {
    return this.http.patch<{ code: number; message: string; body: Blog }>(
      `${this.apiUrl}/${id}/like`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(map(res => res.body));
  }

  /**
   * 👎 Dislike blog
   */
  dislikeBlog(id: string): Observable<Blog> {
    return this.http.patch<{ code: number; message: string; body: Blog }>(
      `${this.apiUrl}/${id}/dislike`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(map(res => res.body));
  }

  /**
   * 📄 Get single blog (public or private)
   */
  getById(id: string): Observable<Blog> {
    const headers = this.getAuthHeaders();
    const url = headers ? `${this.apiUrl}/${id}` : `${this.apiUrl}/public/${id}`;

    return this.http.get<{ code: number; message: string; body: Blog }>(url, {
      headers: headers || undefined
    }).pipe(map(res => res.body));
  }

  /**
   * 📝 Create new blog
   */
  create(data: Partial<Blog>): Observable<Blog> {
    return this.http.post<{ code: number; message: string; body: Blog }>(
      this.apiUrl,
      data,
      { headers: this.getAuthHeaders() }
    ).pipe(map(res => res.body));
  }

  /**
   * ✏️ Update existing blog
   */
  update(id: string, data: Partial<Blog>): Observable<Blog> {
    return this.http.put<{ code: number; message: string; body: Blog }>(
      `${this.apiUrl}/${id}`,
      data,
      { headers: this.getAuthHeaders() }
    ).pipe(map(res => res.body));
  }

  /**
   * 🗑️ Delete blog
   */
  delete(id: string): Observable<{ code: number; message: string }> {
    return this.http.delete<{ code: number; message: string }>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
