import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User } from '../../model/user.model';
import { logout } from '../../stores/auth/auth.actions';
import { selectUser, selectIsLoggedIn } from '../../stores/auth/auth.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  user$!: Observable<User | null>;
  isAdmin: boolean = false;
  showDropdown = false;
  searchQuery: string = '';

  constructor(private router: Router, private store: Store) {
    this.user$ = this.store.select(selectUser);

    this.user$.subscribe(user => {
      this.isAdmin = user?.role === 'ADMIN';
    });

    // 🔁 Redirect after logout
    this.store.select(selectIsLoggedIn).subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
      }
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  goToProfile(): void {
    this.showDropdown = false;
    this.router.navigate(['/admin/profile']);
  }

  logout(): void {
    this.store.dispatch(logout());
    this.showDropdown = false;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  getUserInitial(user: User | null): string {
    return user?.firstName?.charAt(0).toUpperCase() || '';
  }
}
