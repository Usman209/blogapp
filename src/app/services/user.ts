import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:4000/api/auth';

  constructor(private http: HttpClient) {}

  // ✅ Register new user
  register(userData: User): Observable<User> {
    return this.http.post<{ body: User }>(`${this.apiUrl}/register`, userData).pipe(
      map(response => response.body)
    );
  }

  // ✅ Login and get token + user
  login(email: string, password: string): Observable<{ user: User; token: string }> {
    return this.http.post<{ user: User; token: string }>(
      `${this.apiUrl}/login`,
      { email, password }
    );
  }

  // (Optional) Add more API methods like updateProfile, refreshToken, etc.
}
