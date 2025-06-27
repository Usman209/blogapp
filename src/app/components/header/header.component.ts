import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService, User } from '../../services/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  user: User | null = null;
  defaultImage = 'assets/default-user.png';
  showDropdown = false;
  isBrowser: boolean;

  constructor(
    private router: Router,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Subscribe to user changes
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  goToProfile(): void {
    this.showDropdown = false;
    this.router.navigate(['/admin/profile']);
  }

  logout(): void {
    this.userService.logout(); // handles localStorage + user$
    this.showDropdown = false;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
