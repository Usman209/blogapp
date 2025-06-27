import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { Router } from '@angular/router';

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
  private tokenTimer: any = null;

  constructor(private http: HttpClient, private router: Router) {}

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
login(email: string, password: string): Observable<{ token: string; user: any }> {
  return this.http.post<{ token: string; user: any }>(
    'http://localhost:4000/api/auth/login',
    { email, password }
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

logout(isAuto = false): void {
    this.currentUser = null;
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    clearTimeout(this.tokenTimer);

    if (isAuto) {
      console.warn('Logged out automatically due to token expiration.');
    }

    this.router.navigate(['/login']);
  }

  setAutoLogoutFromToken(token: string): void {
    try {
      const decoded: any = jwtDecode(token);
      const expirationTime = decoded.exp * 1000;
      const timeout = expirationTime - Date.now();

      if (timeout > 0) {
        this.tokenTimer = setTimeout(() => this.logout(true), timeout);
      }
    } catch (e) {
      console.error('Failed to decode JWT:', e);
    }
  }
}
