import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

export interface User {
  _id?: string;
  firstName: string;
  lastName?: string;
  email: string;
  password?: string;
  role?: string;
  gender?: string;
  bio?: string;
  profileImg?: string;
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:4000/api/auth';
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {}

  // ✅ Register user
  register(userData: User): Observable<User> {
    return this.http.post<{ body: User }>(`${this.apiUrl}/register`, userData).pipe(
      map(response => {
        const user = response.body;
        return user;
      })
    );
  }

  // ✅ Login (optional, if you implement login API)
// user.service.ts
login(email: string, password: string): Observable<any> {
  return this.http.post<{ token: string; user: any }>(
    'http://localhost:4000/api/auth/login',
    { email, password }
  ).pipe(
    map(response => {
      if (response?.token && response?.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.currentUser = response.user;
        return response.user;
      }
      return null;
    })
  );
}

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'ADMIN';
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('user');
  }
}
