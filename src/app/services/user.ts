import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

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
  private isBrowser: boolean;

  private userSubject: BehaviorSubject<User | null>;
  public user$: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    const stored = this.isBrowser ? localStorage.getItem('user') : null;
    const user = stored ? JSON.parse(stored) : null;

    this.userSubject = new BehaviorSubject<User | null>(user);
    this.user$ = this.userSubject.asObservable();

    if (user) {
      this.currentUser = user;
    }
  }

  // ✅ Register user
  register(userData: User): Observable<User> {
    return this.http.post<{ body: User }>(`${this.apiUrl}/register`, userData).pipe(
      map(response => response.body)
    );
  }

  // ✅ Login
  login(email: string, password: string): Observable<{ token: string; user: any }> {
    return this.http.post<{ token: string; user: any }>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      map(res => {
        if (this.isBrowser) {
          localStorage.setItem('auth_token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        this.currentUser = res.user;
        this.userSubject.next(res.user);
        this.setAutoLogoutFromToken(res.token);
        return res;
      })
    );
  }

  // ✅ Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // ✅ Is Admin
  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'ADMIN';
  }

  // ✅ Is logged in
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  // ✅ Set and broadcast user
  setUser(user: User): void {
    this.currentUser = user;
    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.userSubject.next(user);
  }

  // ✅ Clear user
  clearUser(): void {
    this.currentUser = null;
    if (this.isBrowser) {
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
    }
    this.userSubject.next(null);
  }

  // ✅ Logout
  logout(isAuto = false): void {
    this.clearUser();
    clearTimeout(this.tokenTimer);

    if (isAuto) {
      console.warn('Logged out automatically due to token expiration.');
    }

    this.router.navigate(['/login']);
  }

  // ✅ Auto logout by JWT expiration
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
