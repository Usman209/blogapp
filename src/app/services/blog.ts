import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface Blog {
  _id: string;
  title: string;
  body: string;
  tags?: string[];
  author: string;
  reactions?: {
    likes: number;
    dislikes: number;
  };
  views?: number;
  createdAt?: string;
  updatedAt?: string;
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

  // ✅ Auth headers helper
  private getAuthHeaders(): HttpHeaders | undefined {
    if (!this.isBrowser) return undefined;
    const token = localStorage.getItem('auth_token');
    return token ? new HttpHeaders({ 'auth-token': token }) : undefined;
  }

  // ✅ Get All Blogs (public OR secure depending on token)
  getAll(): Observable<Blog[]> {
    const headers = this.getAuthHeaders();
    const url = headers ? this.apiUrl : `${this.apiUrl}/public`;

    return this.http.get<{ code: number; message: string; body: Blog[] }>(url, {
      headers: headers || undefined
    }).pipe(map((res) => res.body));
  }

  // ✅ Get Blog by ID (public fallback if unauthenticated)
  getById(id: string): Observable<Blog> {
    const headers = this.getAuthHeaders();
    const url = headers ? `${this.apiUrl}/${id}` : `${this.apiUrl}/public/${id}`;

    return this.http.get<{ code: number; message: string; body: Blog }>(url, {
      headers: headers || undefined
    }).pipe(map((res) => res.body));
  }

  // ✅ Create Blog
  create(data: Partial<Blog>): Observable<Blog> {
    return this.http.post<{ code: number; message: string; body: Blog }>(
      this.apiUrl,
      data,
      { headers: this.getAuthHeaders() }
    ).pipe(map((res) => res.body));
  }

  // ✅ Update Blog
  update(id: string, data: Partial<Blog>): Observable<Blog> {
    return this.http.put<{ code: number; message: string; body: Blog }>(
      `${this.apiUrl}/${id}`,
      data,
      { headers: this.getAuthHeaders() }
    ).pipe(map((res) => res.body));
  }

  // ✅ Delete Blog
  delete(id: string): Observable<any> {
    return this.http.delete<{ code: number; message: string }>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
