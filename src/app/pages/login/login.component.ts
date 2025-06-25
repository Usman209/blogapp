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

    this.userService.login(this.email, this.password).subscribe(user => {
      if (user) {
        console.log('User logged in:', user);
        this.router.navigate([user.role === 'admin' ? '/admin' : '/']);
      } else {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
