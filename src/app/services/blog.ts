import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface Blog {
  id: number;
  title: string;
  authorId: number;
  content: string;
  createdAt: string;
}

interface Comment {
  id: number;
  blogId: number;
  author: string;
  content: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private blogsUrl = 'data/blogs.json';
  private commentsUrl = 'data/comments.json';

  constructor(private http: HttpClient) {}

  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.blogsUrl);
  }

  getBlogById(id: number): Observable<Blog | undefined> {
    return this.getBlogs().pipe(
      map(blogs => blogs.find(blog => blog.id === id))
    );
  }

  getCommentsForBlog(blogId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentsUrl).pipe(
      map(comments => comments.filter(c => c.blogId === blogId))
    );
  }

  // Simulated local comment post (in-memory only)
  addComment(newComment: Comment): void {
    console.log('Simulated comment save:', newComment);
    // In a real app, you'd POST to API.
  }
}
