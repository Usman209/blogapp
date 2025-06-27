import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private userService: UserService, private router: Router) {}

onLogin(): void {
  this.errorMessage = '';

  this.userService.login(this.email, this.password).subscribe({
    next: (res) => {
      const { token, user } = res;

      if (token && user) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.userService.setAutoLogoutFromToken(token);

        // 🔄 Redirect everyone to /admin/blogs after login
        this.router.navigate(['/admin/blogs']);
      } else {
        this.errorMessage = 'Invalid login response';
      }
    },
    error: (err) => {
      this.errorMessage = err.error?.message || 'Login failed';
    }
  });
}






  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
