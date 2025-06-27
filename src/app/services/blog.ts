import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  // GET all blogs
  getAll(): Observable<Blog[]> {
    return this.http.get<{ code: number; message: string; body: Blog[] }>(this.apiUrl).pipe(
      map((response) => response.body)
    );
  }

  // GET blog by ID
  getById(id: string): Observable<Blog> {
    return this.http.get<{ code: number; message: string; body: Blog }>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.body)
    );
  }

  // CREATE blog
  create(data: Partial<Blog>): Observable<Blog> {
    return this.http.post<{ code: number; message: string; body: Blog }>(this.apiUrl, data).pipe(
      map((response) => response.body)
    );
  }

  // UPDATE blog
  update(id: string, data: Partial<Blog>): Observable<Blog> {
    return this.http.put<{ code: number; message: string; body: Blog }>(`${this.apiUrl}/${id}`, data).pipe(
      map((response) => response.body)
    );
  }

  // DELETE blog
  delete(id: string): Observable<any> {
    return this.http.delete<{ code: number; message: string }>(`${this.apiUrl}/${id}`);
  }
}
